import { PropertyAccessType } from "@prisma/client";
import { tryCatch } from "../utils/async-handler";
import {
  createPropertySchema,
  updatePropertySchema,
} from "./validators/properties.validator";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

export default {
  getNearbyProperties: tryCatch(async (req, res) => {
    try {
      const {
        lat,
        lon,
        radius = 10,
        page = 1,
        limit = 10,
        distance = 10,
      } = req.query;

      // Validation
      if (!lat || !lon) {
        return res
          .status(400)
          .json({ error: "Latitude and longitude are required." });
      }

      const userLat = parseFloat(lat as string);
      const userLon = parseFloat(lon as string);
      const radiusKm = parseFloat(distance as string);
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Fetch properties with location and related info
      const locations = await prisma.location.findMany({
        where: {
          latitude: { not: null },
          longitude: { not: null },
          property: {
            visibility: true, // optional filter for visible properties
          },
        },
        include: {
          property: {
            include: {
              about: true,
              images: true,
              _count: {
                select: {
                  rooms: true,
                  bookings: true,
                  facilities: true,
                },
              },
              location: true,
              facilities: true,
            },
          },
        },
      });

      const EARTH_RADIUS = 6371; // km

      // Apply Haversine formula
      const nearbyProperties = locations
        .map((loc) => {
          const lat2 = parseFloat(loc.latitude);
          const lon2 = parseFloat(loc.longitude);
          if (isNaN(lat2) || isNaN(lon2)) return null;

          const dLat = ((lat2 - userLat) * Math.PI) / 180;
          const dLon = ((lon2 - userLon) * Math.PI) / 180;

          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((userLat * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) ** 2;

          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = EARTH_RADIUS * c;

          return { ...loc.property, distance };
        })
        .filter((gh) => gh && gh.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);

      const totalItems = nearbyProperties.length;
      const totalPages = Math.ceil(totalItems / take);
      const currentPage = Number(page);

      const paginatedResults = nearbyProperties.slice(skip, skip + take);

      // Build pagination meta
      const pagination = {
        currentPage,
        totalPages,
        totalItems,
        limit: take,
        hasMore: currentPage < totalPages,
        previousPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
      };

      return res.json({
        pagination,
        data: paginatedResults.map((gh) => ({
          _count: gh._count,
          name: gh.name,
          id: gh.id,
          createdAt: gh.createdAt,
          status: gh.status,
          updatedAt: gh.updatedAt,
          type: gh.accessType,
          address: gh.address,
          visibility: gh.visibility,
          // licenseId: gh.licenseId,
          categoryId: gh.categoryId,
          location: gh.location,
          about: gh.about,
          images: gh.images,
          distance: Number(gh.distance.toFixed(2)),
          facilities: gh.facilities,
        })),
      });
    } catch (error) {
      console.error("Error fetching nearby properties:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }),

  getProperties: tryCatch(async (req, res) => {
    try {
      console.log("Fetching properties...");

      // Extract and normalize query parameters
      const {
        minPrice,
        maxPrice,
        city,
        subcity,
        country,
        type,
        search,
        page,
        limit,
        sortField = "createdAt",
        sortDirection = "desc",
        facilityNames,
        categoryId,
        hasRoomsAvailable,
        location,
      } = req.query;

      // Pagination setup
      const pageNumber = Math.max(parseInt(page as string, 10) || 1, 1);
      const pageSize = Math.max(parseInt(limit as string, 10) || 10, 1);
      const skip = (pageNumber - 1) * pageSize;

      // Numeric filters
      const min = parseInt((minPrice as string) || "0", 10);
      const max = parseInt((maxPrice as string) || "100000", 10);

      // Build Prisma filters dynamically
      const filters: any = { AND: [] };

      // 🏙️ Location filters (city, subcity, country)
      if (city || subcity || country) {
        filters.AND.push({
          location: {
            ...(city && { city: { equals: city, mode: "insensitive" } }),
            ...(subcity && {
              subcity: { equals: subcity, mode: "insensitive" },
            }),
            ...(country && {
              country: { equals: country, mode: "insensitive" },
            }),
          },
        });
      }

      // 🏠 Type filter (PRIVATE / SHARED)
      if (type) {
        filters.AND.push({ type: (type as string).toUpperCase() });
      }

      // 💰 Price range (check for at least one condition)
      if (min > 0 || max < 100000) {
        filters.AND.push({
          rooms: {
            some: { price: { gte: min, lte: max } },
          },
        });
      }

      // 🧩 Category filter
      if (categoryId) {
        filters.AND.push({ categoryId: categoryId as string });
      }

      // 🛏️ Availability filter
      if (hasRoomsAvailable === "true") {
        filters.AND.push({
          rooms: { some: { availability: true } },
        });
      }

      // 🏷️ Facilities filter
      if (facilityNames) {
        const facilitiesArray = Array.isArray(facilityNames)
          ? facilityNames
          : (facilityNames as string).split(",");
        filters.AND.push({
          facilities: {
            some: {
              name: { in: facilitiesArray, mode: "insensitive" },
            },
          },
        });
      }

      // 🔍 Global keyword search
      if (search) {
        const s = search.toString();
        filters.AND.push({
          OR: [
            { name: { contains: s, mode: "insensitive" } },
            { location: { city: { contains: s, mode: "insensitive" } } },
            { location: { subcity: { contains: s, mode: "insensitive" } } },
            { location: { country: { contains: s, mode: "insensitive" } } },
          ],
        });
      }

      // 📍 Location string filter
      if (location) {
        const cleanLocation = decodeURIComponent(location.toString().trim());
        filters.AND.push({
          OR: [
            { name: { contains: cleanLocation, mode: "insensitive" } }, // property name
            { address: { contains: cleanLocation, mode: "insensitive" } }, // property address
            {
              location: {
                city: { contains: cleanLocation, mode: "insensitive" },
              },
            },
            {
              location: {
                subcity: { contains: cleanLocation, mode: "insensitive" },
              },
            },
            {
              location: {
                nearby: { contains: cleanLocation, mode: "insensitive" },
              },
            },
          ],
        });
      }

      // ⚙️ Sorting
      const validSortFields = ["id", "name", "createdAt", "price"];
      const orderBy: any = {};
      orderBy["createdAt"] = sortDirection === "asc" ? "asc" : "desc";

      // 📄 Total count for pagination
      const totalItems = await prisma.property.count({
        where: filters.AND.length > 0 ? filters : undefined,
      });
      const totalPages = Math.ceil(totalItems / pageSize);
      const hasMore = pageNumber < totalPages;

      // 📦 Fetch paginated results
      const properties = await prisma.property.findMany({
        where: filters.AND.length > 0 ? filters : undefined,
        include: {
          location: true,
          about: true,
          images: true,
          facilities: true,
          rooms: {
            select: {
              id: true,
              name: true,
              price: true,
              availability: true,
            },
          },
          _count: {
            select: { rooms: true, facilities: true, bookings: true },
          },
        },
        orderBy,
        skip,
        take: pageSize,
      });

      // ✅ Return paginated + filtered data
      res.json({
        data: properties,
        pagination: {
          totalItems,
          currentPage: pageNumber,
          limit: limit,
          totalPages,
          hasMore,
          nextPage: hasMore ? pageNumber + 1 : null,
          previousPage: pageNumber > 1 ? pageNumber - 1 : null,
        },
        sort: { field: sortField, direction: sortDirection },
        filters: {
          city,
          subcity,
          country,
          type,
          minPrice: min,
          maxPrice: max,
          search: search || "",
          categoryId,
          facilityNames,
          hasRoomsAvailable,
        },
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Something went wrong" });
    }
  }),

  getTrendingProperties: tryCatch(async (req, res) => {
    const properties = await prisma.property.findMany({
      include: {
        location: true,
        about: true,
        images: true,
        facilities: true,
        rooms: {
          select: {
            id: true,
            name: true,
            price: true,
            availability: true,
          },
        },
        _count: {
          select: { rooms: true, facilities: true, bookings: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
      where: {},
    });

    res.json({ data: properties, success: true });
  }),

  getPropertyById: tryCatch(async (req, res, next) => {
    const propertyId = req.params.id;
    const propertyDoc = await prisma.property.findFirst({
      where: {
        id: propertyId,
      },
      include: {
        about: true,
        images: true,
        reviews: true,
        location: true,
        contact: true,
        facilities: true,
        rooms: {
          include: {
            images: true,
            features: true,
            services: true,
          },
        },
      },
    });

    res.json({ data: propertyDoc, success: true });
  }),

  // management
  createProperty: tryCatch(async (req, res) => {
    try {
      const user = req.user as { id: string; role: string };

      console.log("reached first step------000-------");
      if (!req.body) {
        return res.status(400).json({ message: "Missing property data" });
      }

      // ✅ Validate property data
      console.log("reached first step-----1---1-1--11----1");

      const validatedData = createPropertySchema.parse(req.body);
      console.log("------------------", { location: validatedData.location });

      console.log("reached first step-----2---2-2--2----2");

      const uploadedImages = validatedData.images ?? [];

      const createdProperty = await prisma.$transaction(
        async (tx) => {
          // 1️⃣ Create property
          const property = await tx.property.create({
            data: {
              name: validatedData.name,
              address: validatedData.address,
              type: "HOTEL",
              accessType: "SHARED",
              visibility: true,
              status: "PENDING",
              // Nested relations
              about: validatedData.about
                ? { create: validatedData.about }
                : undefined,
              location: validatedData.location
                ? { create: validatedData.location }
                : undefined,
              facilities: validatedData.facilities
                ? { create: validatedData.facilities }
                : undefined,
              contact: validatedData.contact
                ? { create: validatedData.contact }
                : undefined,
              images: uploadedImages.length
                ? { create: uploadedImages }
                : undefined,
            },
            include: {
              about: true,
              location: true,
              facilities: true,
              contact: true,
              images: true,
            },
          });

          // 2️⃣ Assign current user as OWNER in ManagedProperty
          await tx.managedProperty.create({
            data: {
              userId: user.id,
              propertyId: property.id,
              role: user.role as any,
            },
          });

          return property;
        },
        { timeout: 30_000 }
      );

      res.status(201).json({
        success: true,
        message: "Property created successfully",
        data: createdProperty,
      });
    } catch (error: any) {
      console.log("------------------------------", { error });
      return res.status(500).json({
        message: error?.message || "Failed to create property",
      });
    }
  }),

  updateProperty: tryCatch(async (req, res) => {
    const user = req.user as { id: string; role: string };
    const { id: userId, role } = user;
    const propertyId = req.params.id;

    if (!req.body) {
      return res.status(400).json({ message: "Missing property data" });
    }

    const validatedData = updatePropertySchema.parse(req.body);

    // 1️⃣ Fetch property with managers
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { managers: true },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // 2️⃣ Authorization: OWNER or ADMIN
    const isOwner = property.managers.some(
      (m) => m.userId === userId && m.role === "OWNER"
    );

    if (!isOwner && role !== "ADMIN") {
      return res.status(403).json({
        message: "You are not authorized to update this property.",
      });
    }

    // 3️⃣ Update nested relations safely
    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: {
        name: validatedData.name,
        address: validatedData.address,
        type: validatedData.type,
        about: validatedData.about
          ? {
              upsert: {
                create: validatedData.about,
                update: validatedData.about,
              },
            }
          : undefined,
        location: validatedData.location
          ? {
              upsert: {
                create: validatedData.location,
                update: validatedData.location,
              },
            }
          : undefined,
        facilities: validatedData.facilities
          ? { deleteMany: {}, create: validatedData.facilities }
          : undefined,
        contact: validatedData.contact
          ? {
              upsert: {
                create: validatedData.contact,
                update: validatedData.contact,
              },
            }
          : undefined,
        images: validatedData.images
          ? { deleteMany: {}, create: validatedData.images }
          : undefined,
      },
      include: {
        about: true,
        location: true,
        facilities: true,
        contact: true,
        images: true,
      },
    });

    res.json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty,
    });
  }),

  deleteProperty: tryCatch(async (req, res) => {
    const user = req.user as { id: string; role: string };
    const { id: propertyId } = req.params;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { managers: true },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const isOwner = property.managers.some(
      (m) => m.userId === user.id && m.role === "OWNER"
    );

    if (!isOwner && user.role !== "ADMIN") {
      return res.status(403).json({
        message: "You are not authorized to delete this property.",
      });
    }

    // Delete in dependency order to avoid FK violations
    await prisma.$transaction(async (tx) => {
      // 1. Get all room IDs for this property
      const rooms = await tx.room.findMany({
        where: { propertyId },
        select: { id: true },
      });
      const roomIds = rooms.map((r) => r.id);

      // 2. Get all booking IDs for this property
      const bookings = await tx.booking.findMany({
        where: { propertyId },
        select: { id: true },
      });
      const bookingIds = bookings.map((b) => b.id);

      // 3. Delete booking dependents
      if (bookingIds.length) {
        await tx.commission.deleteMany({ where: { bookingId: { in: bookingIds } } });
        await tx.payment.deleteMany({ where: { bookingId: { in: bookingIds } } });
        await tx.activity.deleteMany({ where: { bookingId: { in: bookingIds } } });
      }

      // 4. Delete bookings
      await tx.booking.deleteMany({ where: { propertyId } });

      // 5. Delete room-level dependents
      if (roomIds.length) {
        await tx.additionalService.deleteMany({ where: { roomId: { in: roomIds } } });
        await tx.roomFeature.deleteMany({ where: { roomId: { in: roomIds } } });
        await tx.roomImage.deleteMany({ where: { roomId: { in: roomIds } } });
        await tx.favorite.deleteMany({ where: { roomId: { in: roomIds } } });
        await tx.activity.deleteMany({ where: { roomId: { in: roomIds } } });
        await tx.room.deleteMany({ where: { propertyId } });
      }

      // 6. Delete property-level dependents
      await tx.review.deleteMany({ where: { propertyId } });
      await tx.favorite.deleteMany({ where: { propertyId } });
      await tx.managedProperty.deleteMany({ where: { propertyId } });
      await tx.propertyImage.deleteMany({ where: { propertyId } });
      await tx.facility.deleteMany({ where: { propertyId } });
      await tx.propertyService.deleteMany({ where: { propertyId } });
      await tx.carService.deleteMany({ where: { propertyId } });
      await tx.activity.deleteMany({ where: { propertyId } });

      // 7. Delete single-relation dependents (cascade already handles these but be explicit)
      await tx.about.deleteMany({ where: { propertyId } });
      await tx.location.deleteMany({ where: { propertyId } });
      await tx.contact.deleteMany({ where: { propertyId } });
      await tx.license.deleteMany({ where: { propertyId } });

      // 8. Finally delete the property
      await tx.property.delete({ where: { id: propertyId } });
    });

    return res.json({ message: "Property deleted successfully.", success: true });
  }),

  getPropertiesForList: tryCatch(async (req, res) => {
    const user = req.user as { id: string; role: string };
    const { id: userId, role } = user;

    let properties;

    if (role === "ADMIN") {
      // Admin sees all properties
      properties = await prisma.property.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          rooms: { select: { id: true, name: true } },
        },
      });
    } else {
      // Non-admins: filter via ManagedProperty pivot
      let roleFilter: string[] = [];

      if (role === "STAFF") roleFilter = ["STAFF"];
      else if (role === "BROKER") roleFilter = ["BROKER"];
      else if (role === "OWNER") roleFilter = ["OWNER"];

      properties = await prisma.property.findMany({
        where: {
          managers: {
            some: {
              userId,
              role: { in: roleFilter as any },
            },
          },
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          rooms: { select: { id: true, name: true } },
        },
      });
    }

    res.json(properties);
  }),

  createDummyProperty: tryCatch(async (req, res) => {
    const userId = "16N8WesV1IMjvnejlY3qrYpLPpp56BPC"; // Example owner ID

    const uploadedImages = [
      {
        url: "https://t4.ftcdn.net/jpg/00/69/38/91/360_F_69389176_IOhx2ii1TPEmPkchCEzPnFHqR8SlhPwp.jpg",
        name: "guest1.jpg",
      },
      {
        url: "https://res.cloudinary.com/demo/image/upload/v1234567890/guest2.jpg",
        name: "guest2.jpg",
      },
    ];

    const dummyPropertyData = {
      name: "Sunny Stay Property",
      address: "123 Bole Street, Addis Ababa, Ethiopia",
      type: PropertyAccessType.SHARED,
      ownerId: userId,
      about: {
        description:
          "Sunny Stay Property offers comfortable rooms with modern amenities and a cozy atmosphere. Perfect for travelers and families.",
      },
      location: {
        continent: "Africa",
        country: "Ethiopia",
        city: "Addis Ababa",
        subcity: "Bole",
        nearby: "Near Friendship Square",
      },
      facilities: [
        { name: "Free Wi-Fi" },
        { name: "Breakfast included" },
        { name: "Parking available" },
        { name: "24/7 Reception" },
        { name: "Swimming Pool" },
      ],
      contact: {
        phone: "+251912345678",
        email: "info@sunnystay.com",
      },
      images: uploadedImages,
    };

    // Usage with Prisma
    const createdProperty = await prisma.property.create({
      data: {
        name: dummyPropertyData.name,
        address: dummyPropertyData.address,
        type: "VILLA",
        about: { create: dummyPropertyData.about },
        location: { create: dummyPropertyData.location },
        facilities: { create: dummyPropertyData.facilities },
        contact: { create: dummyPropertyData.contact },
        images: { create: dummyPropertyData.images },
      },
      include: {
        about: true,
        location: true,
        facilities: true,
        contact: true,
      },
    });

    console.log(createdProperty);
    res.send(createdProperty);
  }),

  getPropertiesForManagement: tryCatch(async (req, res) => {
    const { id: userId, role } = req.user;

    let properties;

    if (role === "ADMIN") {
      // Admin: fetch all properties
      properties = await prisma.property.findMany({
        include: {
          about: true,
          images: true,
          managers: true, // optional: include staff/broker info
          _count: { select: { rooms: true } },
        },
      });
    } else if (role === "OWNER") {
      // Owner: fetch properties they own
      properties = await prisma.property.findMany({
        where: {
          managers: {
            some: { userId, role: "OWNER" },
          },
        },
        include: {
          about: true,
          images: true,
          managers: true,
          _count: { select: { rooms: true } },
        },
      });
    } else if (role === "STAFF" || role === "BROKER") {
      // Staff/Broker: fetch only properties they are assigned to
      properties = await prisma.property.findMany({
        where: {
          managers: {
            some: { userId, role },
          },
        },
        include: {
          about: true,
          images: true,
          managers: true,
          _count: { select: { rooms: true } },
        },
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access properties.",
      });
    }

    res.json({ data: properties || [] });
  }),

  getPropertiesStatsForManagement: tryCatch(async (req, res) => {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    let propertiesIds: string[] = [];

    switch (userRole) {
      case "ADMIN":
        // Admin sees all properties
        break;
      case "OWNER":
      case "STAFF":
      case "BROKER":
        const managed = await prisma.managedProperty.findMany({
          where: { userId, role: userRole },
          select: { propertyId: true },
        });
        propertiesIds = managed.map((m) => m.propertyId);

        if (!propertiesIds.length) {
          return res.json({
            totalProperties: 0,
            approvedProperties: 0,
            pendingProperties: 0,
            totalRooms: 0,
            totalReviews: 0,
            totalLicensesApproved: 0,
            totalFavorites: 0,
          });
        }
        break;
      default:
        return res.status(403).json({ message: "Access denied" });
    }

    const filter = propertiesIds.length ? { id: { in: propertiesIds } } : {};

    const [
      totalProperties,
      approvedProperties,
      pendingProperties,
      totalRooms,
      totalReviews,
      totalLicensesApproved,
      totalFavorites,
    ] = await Promise.all([
      prisma.property.count({ where: filter }),
      prisma.property.count({ where: { ...filter, status: "APPROVED" } }),
      prisma.property.count({ where: { ...filter, status: "PENDING" } }),
      prisma.room.count({
        where: {
          property: {
            id: { in: propertiesIds.length ? propertiesIds : undefined },
          },
        },
      }),
      prisma.review.count({
        where: {
          property: {
            id: { in: propertiesIds.length ? propertiesIds : undefined },
          },
        },
      }),
      prisma.license.count({
        where: {
          status: "APPROVED",
          propertyId: {
            in: propertiesIds.length ? propertiesIds : undefined,
          },
        },
      }),
      prisma.favorite.count({
        where: {
          property: {
            id: { in: propertiesIds.length ? propertiesIds : undefined },
          },
        },
      }),
    ]);

    return res.json({
      totalProperties,
      approvedProperties,
      pendingProperties,
      totalRooms,
      totalReviews,
      totalLicensesApproved,
      totalFavorites,
    });
  }),

  getPropertyByIdForManagement: tryCatch(async (req, res, next) => {
    const propertyId = req.params.id;

    const propertyDoc = await prisma.property.findFirst({
      where: { id: propertyId },
      include: {
        rooms: true,
        about: true,
        contact: true,
        facilities: true,
        images: true,
        license: true,
        location: true,
        bookings: true,
        managers: {
          where: { role: "STAFF" },
          include: { user: true }, // include user details
        },
      },
    });

    if (!propertyDoc) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Map managers to staffs array
    const { managers, ...rest } = propertyDoc;
    const staffs = managers.map((m) => m.user);

    res.json({ ...rest, staffs });
  }),

  requestNewProperty: tryCatch(async (req, res, next) => {
    const {
      propertyData: {
        name,
        type,
        license: { licenseName, licenseFile },
        documents: { national_id_back, national_id_front },
      },
      accountData: { email, password, phoneNumber, fullName },
      location: { city },
      registerAs,
    } = req.body;

    await prisma.property.create({
      data: {
        name,
        address: "",
        license: { create: { fileUrl: licenseFile, status: "PENDING" } },
      },
    });

    auth.api.signUpEmail({
      body: {
        email: email,
        name: fullName,
        password,
        role: registerAs,
        phone: phoneNumber,
        status: "PENDING",
      },
    });
  }),
};
