import { type NextRequest, NextResponse } from "next/server"

// Mock data generator for demonstration
function generateMockProperties(count: number) {
  const types = ["HOTEL", "HOSTEL", "VILLA", "APARTMENT", "RESORT"]
  const names = [
    "Sunset Paradise",
    "Ocean View Resort",
    "Mountain Lodge",
    "City Center Hotel",
    "Beachfront Villa",
    "Garden Retreat",
    "Lakeside Inn",
    "Riverside Manor",
    "Hilltop Hideaway",
    "Coastal Escape",
  ]
  const addresses = [
    "123 Beach Road, Miami, FL",
    "456 Mountain Ave, Denver, CO",
    "789 Ocean Drive, San Diego, CA",
    "321 City Street, New York, NY",
    "654 Lake View, Seattle, WA",
    "987 Garden Lane, Portland, OR",
    "147 Riverside Dr, Austin, TX",
    "258 Hilltop Rd, Boulder, CO",
    "369 Coastal Hwy, Charleston, SC",
    "741 Paradise Blvd, Honolulu, HI",
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `gh-${i + 1}`,
    name: names[i % names.length],
    address: addresses[i % addresses.length],
    type: types[i % types.length],
    ownerId: "owner-123",
    licenseId: Math.random() > 0.5 ? `LIC-${1000 + i}` : null,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
    images: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
      id: `img-${i}-${j}`,
      name: `Image ${j + 1}`,
      propertyId: `gh-${i + 1}`,
      url: `/placeholder.svg?height=400&width=600&query=luxury property ${names[i % names.length]}`,
    })),
    about: {
      id: `about-${i + 1}`,
      description: `Experience luxury and comfort at ${names[i % names.length]}. Our property offers stunning views, modern amenities, and exceptional service to make your stay unforgettable.`,
      propertyId: `gh-${i + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
    },
    _count: {
      rooms: Math.floor(Math.random() * 20) + 5,
    },
  }))
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 10
  const sortField = searchParams.get("sortField") || "createdAt"
  const sortDirection = (searchParams.get("sortDirection") as "asc" | "desc") || "desc"
  const search = searchParams.get("search") || ""

  // Generate mock data
  const allProperties = generateMockProperties(47)

  // Filter by search
  let filteredProperties = allProperties
  if (search) {
    filteredProperties = allProperties.filter(
      (gh) =>
        gh.name.toLowerCase().includes(search.toLowerCase()) || gh.address.toLowerCase().includes(search.toLowerCase()),
    )
  }

  // Sort
  filteredProperties.sort((a, b) => {
    const aValue = a[sortField as keyof typeof a]
    const bValue = b[sortField as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  // Pagination
  const totalItems = filteredProperties.length
  const totalPages = Math.ceil(totalItems / limit)
  const skip = (page - 1) * limit
  const hasMore = page < totalPages
  const previousPage = page > 1 ? page - 1 : null
  const nextPage = hasMore ? page + 1 : null

  const paginatedProperties = filteredProperties.slice(skip, skip + limit)

  return NextResponse.json({
    data: paginatedProperties,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      limit,
      hasMore,
      previousPage,
      nextPage,
    },
    sort: {
      field: sortField,
      direction: sortDirection,
    },
    filters: {
      search,
    },
  })
}
