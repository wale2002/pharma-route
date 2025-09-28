// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Truck,
//   MapPin,
//   Clock,
//   Package,
//   CheckCircle,
//   ArrowRight,
//   DollarSign,
//   Search,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/hooks/use-toast";
// import {
//   getAvailableOrders,
//   getUserOrders,
//   acceptOrder,
//   updateOrderStatus,
//   Paginated,
//   Order,
// } from "@/lib/api";

// export default function RiderDashboard() {
//   const [activeTab, setActiveTab] = useState<"available" | "my-orders">(
//     "available"
//   );
//   const [availableOrdersData, setAvailableOrdersData] = useState<
//     Paginated<Order>
//   >({ data: [], pagination: { current: 1, pages: 0, total: 0 } });
//   const [myOrdersData, setMyOrdersData] = useState<Paginated<Order>>({
//     data: [],
//     pagination: { current: 1, pages: 0, total: 0 },
//   });
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   // Pagination, search, filter for available orders
//   const [availablePage, setAvailablePage] = useState(1);
//   const [availableSearch, setAvailableSearch] = useState("");
//   const [availableFilter, setAvailableFilter] = useState("pending");

//   // Pagination, search, filter for my orders
//   const [myOrdersPage, setMyOrdersPage] = useState(1);
//   const [myOrdersSearch, setMyOrdersSearch] = useState("");
//   const [myOrdersFilter, setMyOrdersFilter] = useState("all");

//   const { toast } = useToast();

//   useEffect(() => {
//     loadData();
//   }, [
//     availablePage,
//     availableSearch,
//     availableFilter,
//     myOrdersPage,
//     myOrdersSearch,
//     myOrdersFilter,
//   ]);

//   const loadData = async () => {
//     try {
//       const [available, assigned] = await Promise.all([
//         getAvailableOrders(availablePage, 10, availableSearch, availableFilter),
//         getUserOrders(myOrdersPage, 10, myOrdersSearch, myOrdersFilter),
//       ]);
//       setAvailableOrdersData(available);
//       setMyOrdersData(assigned);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     }
//   };

//   const handleAcceptOrder = async (orderId: string) => {
//     setLoading(true);
//     try {
//       const updatedOrder = await acceptOrder(orderId);
//       toast({
//         title: "Order Accepted",
//         description: "You have successfully accepted this delivery order.",
//       });

//       // Update local state: Remove from available, add to my orders
//       const availableIndex = availableOrdersData.data.findIndex(
//         (o) => o._id === orderId
//       );
//       if (availableIndex > -1) {
//         const newAvailableData = availableOrdersData.data.filter(
//           (o) => o._id !== orderId
//         );
//         const newAvailableTotal = availableOrdersData.pagination.total - 1;
//         setAvailableOrdersData((prev) => ({
//           ...prev,
//           data: newAvailableData,
//           pagination: {
//             ...prev.pagination,
//             total: newAvailableTotal,
//             pages: Math.ceil(newAvailableTotal / 10),
//           },
//         }));
//       }

//       // Add to front of my orders data
//       const newMyOrdersData = [updatedOrder, ...myOrdersData.data];
//       const newMyTotal = myOrdersData.pagination.total + 1;
//       setMyOrdersData((prev) => ({
//         ...prev,
//         data: newMyOrdersData,
//         pagination: {
//           ...prev.pagination,
//           total: newMyTotal,
//           pages: Math.ceil(newMyTotal / 10),
//         },
//       }));

//       setAvailablePage(1);
//       setMyOrdersPage(1);
//       setActiveTab("my-orders");
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to accept order. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateStatus = async (
//     orderId: string,
//     status: Order["status"]
//   ) => {
//     setLoading(true);
//     try {
//       await updateOrderStatus(orderId, status);

//       const statusMessages = {
//         picked_up: "Order marked as picked up from pharmacy.",
//         in_transit: "Order marked as in transit to destination.",
//         delivered: "Order marked as delivered successfully!",
//       };

//       toast({
//         title: "Status Updated",
//         description:
//           statusMessages[status as keyof typeof statusMessages] ||
//           "Order status updated.",
//       });
//       setMyOrdersPage(1); // Reset to first page
//       loadData();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update status. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAvailablePageChange = (newPage: number) => {
//     setAvailablePage(newPage);
//   };

//   const handleMyOrdersPageChange = (newPage: number) => {
//     setMyOrdersPage(newPage);
//   };

//   const handleAvailableSearch = (value: string) => {
//     setAvailableSearch(value);
//     setAvailablePage(1);
//   };

//   const handleMyOrdersSearch = (value: string) => {
//     setMyOrdersSearch(value);
//     setMyOrdersPage(1);
//   };

//   const getStatusColor = (status: Order["status"]) => {
//     switch (status) {
//       case "pending":
//         return "bg-warning text-warning-foreground";
//       case "assigned":
//         return "bg-accent text-accent-foreground";
//       case "picked_up":
//         return "bg-primary text-primary-foreground";
//       case "in_transit":
//         return "bg-primary text-primary-foreground";
//       case "delivered":
//         return "bg-success text-success-foreground";
//       default:
//         return "bg-muted text-muted-foreground";
//     }
//   };

//   const getNextStatus = (currentStatus: Order["status"]) => {
//     switch (currentStatus) {
//       case "assigned":
//         return "picked_up";
//       case "picked_up":
//         return "in_transit";
//       case "in_transit":
//         return "delivered";
//       default:
//         return null;
//     }
//   };

//   const getNextStatusLabel = (currentStatus: Order["status"]) => {
//     switch (currentStatus) {
//       case "assigned":
//         return "Mark as Picked Up";
//       case "picked_up":
//         return "Mark as In Transit";
//       case "in_transit":
//         return "Mark as Delivered";
//       default:
//         return null;
//     }
//   };

//   const calculateDistance = () => {
//     // Mock distance calculation
//     return (Math.random() * 10 + 1).toFixed(1);
//   };

//   const estimatedEarnings = myOrdersData.data
//     .filter((order) => order.status === "delivered")
//     .reduce((total, order) => total + order.totalAmount * 0.15, 0); // 15% commission

//   const availableOrders = availableOrdersData.data;
//   const myOrders = myOrdersData.data;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">
//             Rider Dashboard
//           </h1>
//           <p className="text-muted-foreground">
//             Accept orders and manage your deliveries
//           </p>
//         </div>

//         <Card className="bg-gradient-to-r from-accent/10 to-primary/10">
//           <CardContent className="p-4">
//             <div className="flex items-center gap-3">
//               <DollarSign className="h-8 w-8 text-success" />
//               <div>
//                 <p className="text-sm text-muted-foreground">Total Earnings</p>
//                 <p className="text-2xl font-bold text-success">
//                   ${estimatedEarnings.toFixed(2)}
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs
//         value={activeTab}
//         onValueChange={(value) =>
//           setActiveTab(value as "available" | "my-orders")
//         }
//         className="space-y-6"
//       >
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="available">
//             Available Orders ({availableOrdersData.pagination.total})
//           </TabsTrigger>
//           <TabsTrigger value="my-orders">
//             My Orders ({myOrdersData.pagination.total})
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="available">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <CardTitle className="flex items-center gap-2">
//                   <Package className="h-5 w-5" />
//                   Available Orders
//                 </CardTitle>
//                 <CardDescription>
//                   Browse and accept delivery orders in your area
//                 </CardDescription>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search orders..."
//                     className="pl-10 w-48"
//                     value={availableSearch}
//                     onChange={(e) => handleAvailableSearch(e.target.value)}
//                   />
//                 </div>
//                 <Select
//                   value={availableFilter}
//                   onValueChange={setAvailableFilter}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Filter status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="pending">Pending</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {availableOrders.length === 0 ? (
//                 <div className="text-center py-8">
//                   <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <p className="text-muted-foreground">
//                     No available orders at the moment.
//                   </p>
//                   <p className="text-sm text-muted-foreground mt-2">
//                     Check back soon for new delivery opportunities!
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {availableOrders.map((order) => (
//                     <div
//                       key={order._id}
//                       className="border rounded-lg p-6 space-y-4 hover:shadow-medium transition-shadow"
//                     >
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h3 className="font-semibold text-lg">
//                             Order #{order._id.slice(-6)}
//                           </h3>
//                           <p className="text-sm text-muted-foreground">
//                             Created {new Date(order.createdAt).toLocaleString()}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-2xl font-bold text-success">
//                             ${(order.totalAmount * 0.15).toFixed(2)}
//                           </p>
//                           <p className="text-sm text-muted-foreground">
//                             Estimated Earnings
//                           </p>
//                         </div>
//                       </div>

//                       <div className="grid md:grid-cols-2 gap-4">
//                         <div className="space-y-3">
//                           <div className="space-y-1">
//                             <p className="text-sm font-medium">
//                               Pickup Location:
//                             </p>
//                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                               <MapPin className="h-4 w-4 text-secondary" />
//                               MediCare Central Pharmacy
//                             </div>
//                           </div>

//                           <div className="space-y-1">
//                             <p className="text-sm font-medium">
//                               Delivery Address:
//                             </p>
//                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                               <MapPin className="h-4 w-4 text-primary" />
//                               {order.deliveryAddress}
//                             </div>
//                           </div>
//                         </div>

//                         <div className="space-y-3">
//                           <div className="space-y-1">
//                             <p className="text-sm font-medium">
//                               Items ({order.items.length}):
//                             </p>
//                             <div className="space-y-1">
//                               {order.items.slice(0, 2).map((item, index) => (
//                                 <div
//                                   key={index}
//                                   className="text-sm text-muted-foreground"
//                                 >
//                                   • {item.productName} (x{item.quantity})
//                                 </div>
//                               ))}
//                               {order.items.length > 2 && (
//                                 <div className="text-sm text-muted-foreground">
//                                   +{order.items.length - 2} more items
//                                 </div>
//                               )}
//                             </div>
//                           </div>

//                           <div className="space-y-1">
//                             <p className="text-sm font-medium">Distance:</p>
//                             <p className="text-sm text-muted-foreground">
//                               {calculateDistance()} km
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between pt-4 border-t">
//                         <Badge
//                           variant="outline"
//                           className={getStatusColor(order.status)}
//                         >
//                           {order.status.replace("_", " ").toUpperCase()}
//                         </Badge>

//                         <Button
//                           onClick={() => handleAcceptOrder(order._id)}
//                           disabled={loading}
//                           className="bg-gradient-primary hover:opacity-90"
//                         >
//                           <Truck className="h-4 w-4 mr-2" />
//                           Accept Order
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                   {/* Pagination for Available Orders */}
//                   {availableOrdersData.pagination.pages > 1 && (
//                     <div className="flex items-center justify-between pt-4">
//                       <div className="text-sm text-muted-foreground">
//                         Showing {(availablePage - 1) * 10 + 1} to{" "}
//                         {Math.min(
//                           availablePage * 10,
//                           availableOrdersData.pagination.total
//                         )}{" "}
//                         of {availableOrdersData.pagination.total} results
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() =>
//                             handleAvailablePageChange(availablePage - 1)
//                           }
//                           disabled={availablePage === 1}
//                         >
//                           <ChevronLeft className="h-4 w-4" />
//                           Previous
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() =>
//                             handleAvailablePageChange(availablePage + 1)
//                           }
//                           disabled={
//                             availablePage ===
//                             availableOrdersData.pagination.pages
//                           }
//                         >
//                           Next
//                           <ChevronRight className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="my-orders">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <CardTitle className="flex items-center gap-2">
//                   <Truck className="h-5 w-5" />
//                   My Orders
//                 </CardTitle>
//                 <CardDescription>
//                   Manage your assigned deliveries and update order status
//                 </CardDescription>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search orders..."
//                     className="pl-10 w-48"
//                     value={myOrdersSearch}
//                     onChange={(e) => handleMyOrdersSearch(e.target.value)}
//                   />
//                 </div>
//                 <Select
//                   value={myOrdersFilter}
//                   onValueChange={setMyOrdersFilter}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Filter status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Statuses</SelectItem>
//                     <SelectItem value="assigned">Assigned</SelectItem>
//                     <SelectItem value="picked_up">Picked Up</SelectItem>
//                     <SelectItem value="in_transit">In Transit</SelectItem>
//                     <SelectItem value="delivered">Delivered</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {myOrders.length === 0 ? (
//                 <div className="text-center py-8">
//                   <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <p className="text-muted-foreground">
//                     No assigned orders yet.
//                   </p>
//                   <p className="text-sm text-muted-foreground mt-2">
//                     Accept orders from the Available Orders tab to get started!
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {myOrders.map((order) => {
//                     const nextStatus = getNextStatus(order.status);
//                     const nextStatusLabel = getNextStatusLabel(order.status);

//                     return (
//                       <div
//                         key={order._id}
//                         className="border rounded-lg p-6 space-y-4"
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <h3 className="font-semibold text-lg">
//                               Order #{order._id.slice(-6)}
//                             </h3>
//                             <p className="text-sm text-muted-foreground">
//                               {new Date(order.createdAt).toLocaleString()}
//                             </p>
//                           </div>
//                           <Badge
//                             variant="outline"
//                             className={getStatusColor(order.status)}
//                           >
//                             {order.status.replace("_", " ").toUpperCase()}
//                           </Badge>
//                         </div>

//                         <div className="grid md:grid-cols-2 gap-4">
//                           <div className="space-y-3">
//                             <div className="space-y-1">
//                               <p className="text-sm font-medium">Pickup:</p>
//                               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                 <MapPin className="h-4 w-4 text-secondary" />
//                                 MediCare Central Pharmacy
//                               </div>
//                             </div>

//                             <div className="space-y-1">
//                               <p className="text-sm font-medium">Delivery:</p>
//                               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                 <MapPin className="h-4 w-4 text-primary" />
//                                 {order.deliveryAddress}
//                               </div>
//                             </div>
//                           </div>

//                           <div className="space-y-3">
//                             <div className="space-y-1">
//                               <p className="text-sm font-medium">Earnings:</p>
//                               <p className="text-lg font-bold text-success">
//                                 ${(order.totalAmount * 0.15).toFixed(2)}
//                               </p>
//                             </div>

//                             <div className="space-y-1">
//                               <p className="text-sm font-medium">Items:</p>
//                               <div className="text-sm text-muted-foreground">
//                                 {order.items.length} item(s) • $
//                                 {order.totalAmount.toFixed(2)} total
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {order.status !== "delivered" &&
//                           nextStatus &&
//                           nextStatusLabel && (
//                             <div className="flex gap-3 pt-4 border-t">
//                               <Button
//                                 onClick={() =>
//                                   handleUpdateStatus(order._id, nextStatus)
//                                 }
//                                 disabled={loading}
//                                 className="bg-primary hover:bg-primary/90"
//                               >
//                                 <ArrowRight className="h-4 w-4 mr-2" />
//                                 {nextStatusLabel}
//                               </Button>

//                               <Dialog>
//                                 <DialogTrigger asChild>
//                                   <Button
//                                     variant="outline"
//                                     onClick={() => setSelectedOrder(order)}
//                                   >
//                                     View Details
//                                   </Button>
//                                 </DialogTrigger>
//                                 <DialogContent>
//                                   <DialogHeader>
//                                     <DialogTitle>Order Details</DialogTitle>
//                                     <DialogDescription>
//                                       Complete information for Order #
//                                       {order._id.slice(-6)}
//                                     </DialogDescription>
//                                   </DialogHeader>

//                                   {selectedOrder && (
//                                     <div className="space-y-4">
//                                       <div className="space-y-2">
//                                         <p className="font-medium">
//                                           Items to Deliver:
//                                         </p>
//                                         <div className="space-y-2">
//                                           {selectedOrder.items.map(
//                                             (item, index) => (
//                                               <div
//                                                 key={index}
//                                                 className="flex justify-between p-2 bg-muted rounded"
//                                               >
//                                                 <span>{item.productName}</span>
//                                                 <span>
//                                                   Qty: {item.quantity} • $
//                                                   {item.price}
//                                                 </span>
//                                               </div>
//                                             )
//                                           )}
//                                         </div>
//                                       </div>

//                                       <div className="space-y-2">
//                                         <p className="font-medium">
//                                           Delivery Information:
//                                         </p>
//                                         <div className="p-3 bg-muted rounded">
//                                           <p className="text-sm">
//                                             {selectedOrder.deliveryAddress}
//                                           </p>
//                                         </div>
//                                       </div>

//                                       <div className="flex justify-between items-center pt-4 border-t">
//                                         <span className="font-medium">
//                                           Total Order Value:
//                                         </span>
//                                         <span className="text-lg font-bold">
//                                           $
//                                           {selectedOrder.totalAmount.toFixed(2)}
//                                         </span>
//                                       </div>
//                                     </div>
//                                   )}
//                                 </DialogContent>
//                               </Dialog>
//                             </div>
//                           )}

//                         {order.status === "delivered" && (
//                           <div className="bg-success/10 border border-success/20 rounded-lg p-3">
//                             <div className="flex items-center gap-2">
//                               <CheckCircle className="h-5 w-5 text-success" />
//                               <span className="font-medium text-success">
//                                 Delivery Completed
//                               </span>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                   {/* Pagination for My Orders */}
//                   {myOrdersData.pagination.pages > 1 && (
//                     <div className="flex items-center justify-between pt-4">
//                       <div className="text-sm text-muted-foreground">
//                         Showing {(myOrdersPage - 1) * 10 + 1} to{" "}
//                         {Math.min(
//                           myOrdersPage * 10,
//                           myOrdersData.pagination.total
//                         )}{" "}
//                         of {myOrdersData.pagination.total} results
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() =>
//                             handleMyOrdersPageChange(myOrdersPage - 1)
//                           }
//                           disabled={myOrdersPage === 1}
//                         >
//                           <ChevronLeft className="h-4 w-4" />
//                           Previous
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() =>
//                             handleMyOrdersPageChange(myOrdersPage + 1)
//                           }
//                           disabled={
//                             myOrdersPage === myOrdersData.pagination.pages
//                           }
//                         >
//                           Next
//                           <ChevronRight className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/RiderDashboard.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Truck,
  MapPin,
  Clock,
  Package,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  getAvailableOrders,
  getUserOrders,
  acceptOrder,
  updateOrderStatus,
  Paginated,
  Order,
} from "@/lib/api";

export default function RiderDashboard() {
  const [activeTab, setActiveTab] = useState<"available" | "my-orders">(
    "available"
  );
  const [availableOrdersData, setAvailableOrdersData] = useState<
    Paginated<Order>
  >({ data: [], pagination: { current: 1, pages: 0, total: 0 } });
  const [myOrdersData, setMyOrdersData] = useState<Paginated<Order>>({
    data: [],
    pagination: { current: 1, pages: 0, total: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Pagination, search, filter for available orders
  const [availablePage, setAvailablePage] = useState(1);
  const [availableSearch, setAvailableSearch] = useState("");
  const [availableFilter, setAvailableFilter] = useState("pending");

  // Pagination, search, filter for my orders
  const [myOrdersPage, setMyOrdersPage] = useState(1);
  const [myOrdersSearch, setMyOrdersSearch] = useState("");
  const [myOrdersFilter, setMyOrdersFilter] = useState("all");

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [
    availablePage,
    availableSearch,
    availableFilter,
    myOrdersPage,
    myOrdersSearch,
    myOrdersFilter,
  ]);

  const loadData = async () => {
    try {
      const [available, assigned] = await Promise.all([
        getAvailableOrders(availablePage, 10, availableSearch, availableFilter),
        getUserOrders(myOrdersPage, 10, myOrdersSearch, myOrdersFilter),
      ]);
      setAvailableOrdersData(available);
      setMyOrdersData(assigned);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    setLoading(true);
    try {
      const updatedOrder = await acceptOrder(orderId);
      toast({
        title: "Order Accepted",
        description: "You have successfully accepted this delivery order.",
      });

      // Update local state: Remove from available, add to my orders
      const availableIndex = availableOrdersData.data.findIndex(
        (o) => o._id === orderId
      );
      if (availableIndex > -1) {
        const newAvailableData = availableOrdersData.data.filter(
          (o) => o._id !== orderId
        );
        const newAvailableTotal = availableOrdersData.pagination.total - 1;
        setAvailableOrdersData((prev) => ({
          ...prev,
          data: newAvailableData,
          pagination: {
            ...prev.pagination,
            total: newAvailableTotal,
            pages: Math.ceil(newAvailableTotal / 10),
          },
        }));
      }

      // Add to front of my orders data
      const newMyOrdersData = [updatedOrder, ...myOrdersData.data];
      const newMyTotal = myOrdersData.pagination.total + 1;
      setMyOrdersData((prev) => ({
        ...prev,
        data: newMyOrdersData,
        pagination: {
          ...prev.pagination,
          total: newMyTotal,
          pages: Math.ceil(newMyTotal / 10),
        },
      }));

      setAvailablePage(1);
      setMyOrdersPage(1);
      setActiveTab("my-orders");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    orderId: string,
    status: Order["status"]
  ) => {
    setLoading(true);
    try {
      await updateOrderStatus(orderId, status);

      const statusMessages = {
        picked_up: "Order marked as picked up from pharmacy.",
        in_transit: "Order marked as in transit to destination.",
        delivered: "Order marked as delivered successfully!",
      };

      toast({
        title: "Status Updated",
        description:
          statusMessages[status as keyof typeof statusMessages] ||
          "Order status updated.",
      });
      setMyOrdersPage(1); // Reset to first page
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvailablePageChange = (newPage: number) => {
    setAvailablePage(newPage);
  };

  const handleMyOrdersPageChange = (newPage: number) => {
    setMyOrdersPage(newPage);
  };

  const handleAvailableSearch = (value: string) => {
    setAvailableSearch(value);
    setAvailablePage(1);
  };

  const handleMyOrdersSearch = (value: string) => {
    setMyOrdersSearch(value);
    setMyOrdersPage(1);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-warning text-warning-foreground";
      case "assigned":
        return "bg-accent text-accent-foreground";
      case "picked_up":
        return "bg-primary text-primary-foreground";
      case "in_transit":
        return "bg-primary text-primary-foreground";
      case "delivered":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getNextStatus = (currentStatus: Order["status"]) => {
    switch (currentStatus) {
      case "assigned":
        return "picked_up";
      case "picked_up":
        return "in_transit";
      case "in_transit":
        return "delivered";
      default:
        return null;
    }
  };

  const getNextStatusLabel = (currentStatus: Order["status"]) => {
    switch (currentStatus) {
      case "assigned":
        return "Mark as Picked Up";
      case "picked_up":
        return "Mark as In Transit";
      case "in_transit":
        return "Mark as Delivered";
      default:
        return null;
    }
  };

  const calculateDistance = () => {
    // Mock distance calculation
    return (Math.random() * 10 + 1).toFixed(1);
  };

  const estimatedEarnings = myOrdersData.data
    .filter((order) => order.status === "delivered")
    .reduce((total, order) => total + order.totalAmount * 0.15, 0); // 15% commission

  const availableOrders = availableOrdersData.data;
  const myOrders = myOrdersData.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Rider Dashboard
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Accept orders and manage your deliveries
          </p>
        </div>

        <Card className="w-full md:w-auto bg-gradient-to-r from-accent/10 to-primary/10">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <DollarSign className="h-5 w-5 md:h-8 md:w-8 text-success" />
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Total Earnings
                </p>
                <p className="text-lg md:text-2xl font-bold text-success">
                  ${estimatedEarnings.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "available" | "my-orders")
        }
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available" className="text-sm md:text-base">
            Available ({availableOrdersData.pagination.total})
          </TabsTrigger>
          <TabsTrigger value="my-orders" className="text-sm md:text-base">
            My Orders ({myOrdersData.pagination.total})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 pb-4 md:pb-6">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <Package className="h-4 w-4 md:h-5 md:w-5" />
                  Available Orders
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Browse and accept delivery orders in your area
                </CardDescription>
              </div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-7 md:pl-10 w-full md:w-36 lg:w-48 text-xs md:text-sm h-8 md:h-auto"
                    value={availableSearch}
                    onChange={(e) => handleAvailableSearch(e.target.value)}
                  />
                </div>
                <Select
                  value={availableFilter}
                  onValueChange={setAvailableFilter}
                >
                  <SelectTrigger className="w-full md:w-[180px] text-xs md:text-sm h-8 md:h-auto">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent className="text-xs md:text-sm">
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {availableOrders.length === 0 ? (
                <div className="text-center py-4 md:py-8">
                  <Package className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mx-auto mb-2 md:mb-4" />
                  <p className="text-sm md:text-base text-muted-foreground">
                    No available orders at the moment.
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-2">
                    Check back soon for new delivery opportunities!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableOrders.map((order) => (
                    <div
                      key={order._id}
                      className="border rounded-lg p-3 md:p-6 space-y-3 md:space-y-4 hover:shadow-medium transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
                        <div>
                          <h3 className="font-semibold text-base md:text-lg">
                            Order #{order._id.slice(-6)}
                          </h3>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Created {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl md:text-2xl font-bold text-success">
                            ${(order.totalAmount * 0.15).toFixed(2)}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Estimated Earnings
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-2 md:space-y-3">
                          <div className="space-y-1">
                            <p className="text-xs md:text-sm font-medium">
                              Pickup Location:
                            </p>
                            <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 md:h-4 md:w-4 text-secondary" />
                              MediCare Central Pharmacy
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs md:text-sm font-medium">
                              Delivery Address:
                            </p>
                            <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                              {order.deliveryAddress}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 md:space-y-3">
                          <div className="space-y-1">
                            <p className="text-xs md:text-sm font-medium">
                              Items ({order.items.length}):
                            </p>
                            <div className="space-y-1">
                              {order.items.slice(0, 2).map((item, index) => (
                                <div
                                  key={index}
                                  className="text-xs md:text-sm text-muted-foreground"
                                >
                                  • {item.productName} (x{item.quantity})
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <div className="text-xs md:text-sm text-muted-foreground">
                                  +{order.items.length - 2} more items
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs md:text-sm font-medium">
                              Distance:
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {calculateDistance()} km
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-3 md:pt-4 border-t gap-2 md:gap-0">
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(
                            order.status
                          )} text-xs md:text-sm`}
                        >
                          {order.status.replace("_", " ").toUpperCase()}
                        </Badge>

                        <Button
                          onClick={() => handleAcceptOrder(order._id)}
                          disabled={loading}
                          className="w-full md:w-auto bg-gradient-primary hover:opacity-90 text-sm md:text-base"
                        >
                          <Truck className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                          Accept Order
                        </Button>
                      </div>
                    </div>
                  ))}
                  {/* Pagination for Available Orders */}
                  {availableOrdersData.pagination.pages > 1 && (
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-4 gap-2 md:gap-0">
                      <div className="text-xs md:text-sm text-muted-foreground">
                        Showing {(availablePage - 1) * 10 + 1} to{" "}
                        {Math.min(
                          availablePage * 10,
                          availableOrdersData.pagination.total
                        )}{" "}
                        of {availableOrdersData.pagination.total} results
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs md:text-sm h-8 md:h-auto"
                          onClick={() =>
                            handleAvailablePageChange(availablePage - 1)
                          }
                          disabled={availablePage === 1}
                        >
                          <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                          Prev
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs md:text-sm h-8 md:h-auto"
                          onClick={() =>
                            handleAvailablePageChange(availablePage + 1)
                          }
                          disabled={
                            availablePage ===
                            availableOrdersData.pagination.pages
                          }
                        >
                          Next
                          <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-orders">
          <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 pb-4 md:pb-6">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <Truck className="h-4 w-4 md:h-5 md:w-5" />
                  My Orders
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Manage your assigned deliveries and update order status
                </CardDescription>
              </div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-7 md:pl-10 w-full md:w-36 lg:w-48 text-xs md:text-sm h-8 md:h-auto"
                    value={myOrdersSearch}
                    onChange={(e) => handleMyOrdersSearch(e.target.value)}
                  />
                </div>
                <Select
                  value={myOrdersFilter}
                  onValueChange={setMyOrdersFilter}
                >
                  <SelectTrigger className="w-full md:w-[180px] text-xs md:text-sm h-8 md:h-auto">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent className="text-xs md:text-sm">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="picked_up">Picked Up</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {myOrders.length === 0 ? (
                <div className="text-center py-4 md:py-8">
                  <Truck className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mx-auto mb-2 md:mb-4" />
                  <p className="text-sm md:text-base text-muted-foreground">
                    No assigned orders yet.
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-2">
                    Accept orders from the Available Orders tab to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((order) => {
                    const nextStatus = getNextStatus(order.status);
                    const nextStatusLabel = getNextStatusLabel(order.status);

                    return (
                      <div
                        key={order._id}
                        className="border rounded-lg p-3 md:p-6 space-y-3 md:space-y-4"
                      >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
                          <div>
                            <h3 className="font-semibold text-base md:text-lg">
                              Order #{order._id.slice(-6)}
                            </h3>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(
                              order.status
                            )} text-xs md:text-sm`}
                          >
                            {order.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div className="space-y-2 md:space-y-3">
                            <div className="space-y-1">
                              <p className="text-xs md:text-sm font-medium">
                                Pickup:
                              </p>
                              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 md:h-4 md:w-4 text-secondary" />
                                MediCare Central Pharmacy
                              </div>
                            </div>

                            <div className="space-y-1">
                              <p className="text-xs md:text-sm font-medium">
                                Delivery:
                              </p>
                              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                                {order.deliveryAddress}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 md:space-y-3">
                            <div className="space-y-1">
                              <p className="text-xs md:text-sm font-medium">
                                Earnings:
                              </p>
                              <p className="text-base md:text-lg font-bold text-success">
                                ${(order.totalAmount * 0.15).toFixed(2)}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-xs md:text-sm font-medium">
                                Items:
                              </p>
                              <div className="text-xs md:text-sm text-muted-foreground">
                                {order.items.length} item(s) • $
                                {order.totalAmount.toFixed(2)} total
                              </div>
                            </div>
                          </div>
                        </div>

                        {order.status !== "delivered" &&
                          nextStatus &&
                          nextStatusLabel && (
                            <div className="flex flex-col md:flex-row gap-2 md:gap-3 pt-3 md:pt-4 border-t">
                              <Button
                                onClick={() =>
                                  handleUpdateStatus(order._id, nextStatus)
                                }
                                disabled={loading}
                                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-sm md:text-base"
                              >
                                <ArrowRight className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                {nextStatusLabel}
                              </Button>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full md:w-auto text-sm md:text-base"
                                    onClick={() => setSelectedOrder(order)}
                                  >
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[95vw] md:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle className="text-base md:text-lg">
                                      Order Details
                                    </DialogTitle>
                                    <DialogDescription className="text-sm">
                                      Complete information for Order #
                                      {order._id.slice(-6)}
                                    </DialogDescription>
                                  </DialogHeader>

                                  {selectedOrder && (
                                    <div className="space-y-3 md:space-y-4">
                                      <div className="space-y-2">
                                        <p className="font-medium text-sm md:text-base">
                                          Items to Deliver:
                                        </p>
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                          {selectedOrder.items.map(
                                            (item, index) => (
                                              <div
                                                key={index}
                                                className="flex justify-between p-2 bg-muted rounded text-xs md:text-sm"
                                              >
                                                <span>{item.productName}</span>
                                                <span>
                                                  Qty: {item.quantity} • $
                                                  {item.price}
                                                </span>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <p className="font-medium text-sm md:text-base">
                                          Delivery Information:
                                        </p>
                                        <div className="p-2 md:p-3 bg-muted rounded text-xs md:text-sm">
                                          <p>{selectedOrder.deliveryAddress}</p>
                                        </div>
                                      </div>

                                      <div className="flex justify-between items-center pt-3 md:pt-4 border-t text-sm md:text-base">
                                        <span className="font-medium">
                                          Total Order Value:
                                        </span>
                                        <span className="text-base md:text-lg font-bold">
                                          $
                                          {selectedOrder.totalAmount.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}

                        {order.status === "delivered" && (
                          <div className="bg-success/10 border border-success/20 rounded-lg p-2 md:p-3">
                            <div className="flex items-center gap-1 md:gap-2">
                              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-success" />
                              <span className="font-medium text-sm md:text-base text-success">
                                Delivery Completed
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* Pagination for My Orders */}
                  {myOrdersData.pagination.pages > 1 && (
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-4 gap-2 md:gap-0">
                      <div className="text-xs md:text-sm text-muted-foreground">
                        Showing {(myOrdersPage - 1) * 10 + 1} to{" "}
                        {Math.min(
                          myOrdersPage * 10,
                          myOrdersData.pagination.total
                        )}{" "}
                        of {myOrdersData.pagination.total} results
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs md:text-sm h-8 md:h-auto"
                          onClick={() =>
                            handleMyOrdersPageChange(myOrdersPage - 1)
                          }
                          disabled={myOrdersPage === 1}
                        >
                          <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                          Prev
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs md:text-sm h-8 md:h-auto"
                          onClick={() =>
                            handleMyOrdersPageChange(myOrdersPage + 1)
                          }
                          disabled={
                            myOrdersPage === myOrdersData.pagination.pages
                          }
                        >
                          Next
                          <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
