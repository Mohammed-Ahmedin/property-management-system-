import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { ArrowLeft, Calendar, Users, CreditCard, Download, Loader2, Package, BedDouble, CheckCircle2, Clock, Star, Share2, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { generateReceiptPDF } from "@/utils/pdf";
import FormatedAmount from "@/components/shared/formatted-amount";
import type { BookingDetailDataResponse } from "@/hooks/api/types/booking.types";
import { cn } from "@/lib/utils";

export default function DataContainer({ data }: { data: BookingDetailDataResponse }) {
  const booking = data;
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadReceipt = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = await generateReceiptPDF(booking);
      pdf.save(`booking-receipt-${booking.id}.pdf`);
    } catch (e) { console.error(e); }
    finally { setIsGeneratingPDF(false); }
  };

  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const roomImg = booking.room?.images?.[0]?.url;
  const isApproved = booking.status === "APPROVED";
  const isPending = booking.status === "PENDING";

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background pb-16">
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <Link to="/account/bookings" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Bookings
        </Link>

        <div className="relative rounded-3xl overflow-hidden mb-6 shadow-2xl">
          {roomImg ? (
            <div className="h-48 md:h-64">
              <img src={roomImg} alt={booking.room?.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-r from-primary to-primary/70" />
          )}
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
            <p className="text-white/50 text-xs font-mono mb-1">#{booking.id.slice(0, 16)}...</p>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-2">{booking.property?.name}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={booking.status} paymentStatus={booking.payment?.status} />
              {booking.payment?.status && (
                <span className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-medium backdrop-blur-sm">
                  Payment: {booking.payment.status}
                </span>
              )}
              <span className="text-xs text-white/50 bg-white/10 px-2.5 py-0.5 rounded-full">
                {booking.manualBooked ? "Manual" : "Online"}
              </span>
            </div>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors text-white">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={handleDownloadReceipt} className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors text-white">
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center mb-6 bg-card border border-border rounded-2xl p-4 overflow-x-auto">
          {[
            { label: "Booked", done: true, icon: "check" },
            { label: "Pending", done: !isPending, icon: "clock" },
            { label: "Approved", done: isApproved, icon: "check" },
            { label: "Stay", done: false, icon: "star" },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1 flex-1 min-w-[60px]">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs", step.done ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                  {step.icon === "check" ? <CheckCircle2 className="w-4 h-4" /> : step.icon === "clock" ? <Clock className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                </div>
                <span className={cn("text-xs font-medium whitespace-nowrap", step.done ? "text-primary" : "text-muted-foreground")}>{step.label}</span>
              </div>
              {i < arr.length - 1 && <div className={cn("h-0.5 flex-1 mx-1 rounded-full", step.done ? "bg-primary" : "bg-border")} />}
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-4"><Calendar className="w-4 h-4 text-primary" /> Your Stay</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Check-in", value: fmt(checkIn), sub: "From 15:00" },
                  { label: "Check-out", value: fmt(checkOut), sub: "Until 12:00" },
                  { label: "Duration", value: `${nights} night${nights !== 1 ? "s" : ""}`, sub: null },
                  { label: "Guests", value: `${booking.guests} guest${booking.guests !== 1 ? "s" : ""}`, sub: null },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    <p className="font-semibold text-sm">{value}</p>
                    {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-4"><BedDouble className="w-4 h-4 text-primary" /> Room Details</h3>
              <div className="flex items-center gap-3">
                {roomImg && <img src={roomImg} alt={booking.room?.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />}
                <div>
                  <p className="font-bold">{booking.room?.name}</p>
                  {(booking.room as any)?.description && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{(booking.room as any).description}</p>}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4 text-primary" /> Payment Details</h3>
              <div>
                {[
                  { label: "Base Price", value: `${booking.currency} ${Number(booking.basePrice).toLocaleString()}`, green: false },
                  { label: "Tax (15%)", value: `${booking.currency} ${Number(booking.taxAmount).toLocaleString()}`, green: false },
                  ...(Number(booking.discount) > 0 ? [{ label: "Discount", value: `-${booking.currency} ${Number(booking.discount).toLocaleString()}`, green: true }] : []),
                  { label: "Method", value: booking.payment?.method || "—", green: false },
                ].map(({ label, value, green }) => (
                  <div key={label} className="flex justify-between items-center text-sm py-2.5 border-b border-border/50 last:border-0">
                    <span className="text-muted-foreground">{label}</span>
                    <span className={cn("font-medium", green && "text-emerald-600")}>{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3">
                  <span className="font-semibold text-sm">Payment Status</span>
                  <StatusBadge status={booking.payment?.status || "PENDING"} />
                </div>
                {booking.payment?.transactionRef && (
                  <div className="mt-3 p-3 rounded-xl bg-muted/40 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-0.5">Transaction Ref</p>
                    <p className="font-mono text-xs break-all">{booking.payment.transactionRef}</p>
                  </div>
                )}
              </div>
            </div>

            {(booking.additionalServices?.length ?? 0) > 0 && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-4"><Package className="w-4 h-4 text-primary" /> Additional Services</h3>
                <ul className="space-y-2">
                  {booking.additionalServices.map((s: any, i: number) => (
                    <li key={i} className="flex justify-between items-center text-sm py-2.5 px-3 rounded-xl bg-muted/40 border border-border/50">
                      <span className="font-medium">{s?.name}</span>
                      <FormatedAmount amount={Number(s?.price)} className="font-semibold text-sm text-primary" />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={handleDownloadReceipt} disabled={isGeneratingPDF} className="w-full gap-2 rounded-xl h-12 font-semibold" size="lg">
              {isGeneratingPDF ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Download className="w-4 h-4" />Download Receipt</>}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="sticky top-20 bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground">
                <p className="text-xs opacity-70 mb-1">Total Amount</p>
                <FormatedAmount amount={Number(booking.totalAmount)} className="text-3xl font-bold text-white" />
                <p className="text-xs opacity-60 mt-1">{nights} night{nights !== 1 ? "s" : ""} · {booking.guests} guest{booking.guests !== 1 ? "s" : ""}</p>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { label: "Property", value: booking.property?.name },
                  { label: "Room", value: booking.room?.name },
                  { label: "Check-in", value: fmt(checkIn) },
                  { label: "Check-out", value: fmt(checkOut) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-right max-w-[55%] truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <h3 className="font-semibold text-sm">Status</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Booking</span>
                <StatusBadge status={booking.status} paymentStatus={booking.payment?.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Type</span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted border">{booking.manualBooked ? "Manual" : "Online"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
