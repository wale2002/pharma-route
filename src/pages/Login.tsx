// // // pages/Login.tsx
// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useAuth } from "@/hooks/useAuth";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Stethoscope, Pill, Truck, Eye, EyeOff } from "lucide-react";
// // import { useToast } from "@/hooks/use-toast";

// // export default function Login() {
// //   const navigate = useNavigate();
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [isRegister, setIsRegister] = useState(false);
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     role: "clinic" as "clinic" | "pharmacy" | "rider",
// //     organization: "",
// //     address: "",
// //     phone: "",
// //   });

// //   const { login, register, loading } = useAuth();
// //   const { toast } = useToast();

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!email || !password) {
// //       toast({
// //         title: "Error",
// //         description: "Please enter email and password",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     try {
// //       if (isRegister) {
// //         if (
// //           !formData.name ||
// //           !formData.address ||
// //           !formData.phone ||
// //           !formData.role
// //         ) {
// //           toast({
// //             title: "Error",
// //             description: "Please fill all required fields",
// //             variant: "destructive",
// //           });
// //           return;
// //         }
// //         await register({
// //           email,
// //           password,
// //           ...formData,
// //         });
// //         toast({
// //           title: "Account created successfully!",
// //           description: "Welcome to MediLink. Redirecting to dashboard...",
// //         });
// //         // Optionally auto-login after register
// //         await login(email, password);
// //       } else {
// //         await login(email, password);
// //         toast({
// //           title: "Welcome back!",
// //           description: "You have been logged in successfully.",
// //         });
// //       }
// //       // Delay navigation slightly to allow state update
// //       setTimeout(() => navigate("/"), 500);
// //     } catch (error) {
// //       console.error("Auth error:", error);
// //       toast({
// //         title: "Error",
// //         description:
// //           error instanceof Error ? error.message : "An error occurred",
// //         variant: "destructive",
// //       });
// //     }
// //   };

// //   const demoCredentials = [
// //     {
// //       role: "clinic",
// //       email: "clinic@medilink.com",
// //       icon: Stethoscope,
// //       color: "text-primary",
// //     },
// //     {
// //       role: "pharmacy",
// //       email: "pharmacy@medilink.com",
// //       icon: Pill,
// //       color: "text-secondary",
// //     },
// //     {
// //       role: "rider",
// //       email: "rider@medilink.com",
// //       icon: Truck,
// //       color: "text-accent",
// //     },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
// //       <div className="w-full max-w-md space-y-6">
// //         {/* Logo */}
// //         <div className="text-center">
// //           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 inline-block mb-4">
// //             <h1 className="text-3xl font-bold text-white flex items-center gap-3">
// //               <div className="bg-white/20 rounded-lg p-2">
// //                 <Stethoscope className="h-8 w-8 text-white" />
// //               </div>
// //               MediLink
// //             </h1>
// //           </div>
// //           <p className="text-white/80 text-lg">
// //             Connecting Healthcare • Pharmacy • Delivery
// //           </p>
// //         </div>

// //         {/* Auth Form */}
// //         <Card className="bg-white/95 backdrop-blur-md border-white/20 shadow-strong">
// //           <CardHeader className="text-center">
// //             <CardTitle className="text-2xl text-foreground">
// //               {isRegister ? "Create Account" : "Welcome Back"}
// //             </CardTitle>
// //             <CardDescription>
// //               {isRegister
// //                 ? "Join the MediLink network today"
// //                 : "Sign in to your MediLink account"}
// //             </CardDescription>
// //           </CardHeader>

// //           <CardContent className="space-y-4">
// //             <form onSubmit={handleSubmit} className="space-y-4">
// //               {isRegister && (
// //                 <>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="name">Name/Organization</Label>
// //                     <Input
// //                       id="name"
// //                       value={formData.name}
// //                       onChange={(e) =>
// //                         setFormData((prev) => ({
// //                           ...prev,
// //                           name: e.target.value,
// //                         }))
// //                       }
// //                       placeholder="Enter your name or organization"
// //                       required
// //                     />
// //                   </div>

// //                   <div className="space-y-2">
// //                     <Label htmlFor="role">Role</Label>
// //                     <select
// //                       id="role"
// //                       aria-label="Role"
// //                       value={formData.role}
// //                       onChange={(e) =>
// //                         setFormData((prev) => ({
// //                           ...prev,
// //                           role: e.target.value as
// //                             | "clinic"
// //                             | "pharmacy"
// //                             | "rider",
// //                         }))
// //                       }
// //                       className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
// //                       required
// //                     >
// //                       <option value="clinic">Clinic/Hospital</option>
// //                       <option value="pharmacy">Pharmacy</option>
// //                       <option value="rider">Delivery Rider</option>
// //                     </select>
// //                   </div>

// //                   {formData.role !== "rider" && (
// //                     <div className="space-y-2">
// //                       <Label htmlFor="organization">Organization</Label>
// //                       <Input
// //                         id="organization"
// //                         value={formData.organization}
// //                         onChange={(e) =>
// //                           setFormData((prev) => ({
// //                             ...prev,
// //                             organization: e.target.value,
// //                           }))
// //                         }
// //                         placeholder="Organization name"
// //                       />
// //                     </div>
// //                   )}

// //                   <div className="space-y-2">
// //                     <Label htmlFor="address">Address</Label>
// //                     <Input
// //                       id="address"
// //                       value={formData.address}
// //                       onChange={(e) =>
// //                         setFormData((prev) => ({
// //                           ...prev,
// //                           address: e.target.value,
// //                         }))
// //                       }
// //                       placeholder="Full address"
// //                       required
// //                     />
// //                   </div>

// //                   <div className="space-y-2">
// //                     <Label htmlFor="phone">Phone</Label>
// //                     <Input
// //                       id="phone"
// //                       type="tel"
// //                       value={formData.phone}
// //                       onChange={(e) =>
// //                         setFormData((prev) => ({
// //                           ...prev,
// //                           phone: e.target.value,
// //                         }))
// //                       }
// //                       placeholder="+1-555-0000"
// //                       required
// //                     />
// //                   </div>
// //                 </>
// //               )}

// //               <div className="space-y-2">
// //                 <Label htmlFor="email">Email</Label>
// //                 <Input
// //                   id="email"
// //                   type="email"
// //                   value={email}
// //                   onChange={(e) => setEmail(e.target.value)}
// //                   placeholder="Enter your email"
// //                   required
// //                 />
// //               </div>

// //               <div className="space-y-2">
// //                 <Label htmlFor="password">Password</Label>
// //                 <div className="relative">
// //                   <Input
// //                     id="password"
// //                     type={showPassword ? "text" : "password"}
// //                     value={password}
// //                     onChange={(e) => setPassword(e.target.value)}
// //                     placeholder="Enter your password"
// //                     required
// //                   />
// //                   <Button
// //                     type="button"
// //                     variant="ghost"
// //                     size="sm"
// //                     className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
// //                     onClick={() => setShowPassword(!showPassword)}
// //                   >
// //                     {showPassword ? (
// //                       <EyeOff className="h-4 w-4" />
// //                     ) : (
// //                       <Eye className="h-4 w-4" />
// //                     )}
// //                   </Button>
// //                 </div>
// //               </div>

// //               <Button type="submit" className="w-full" disabled={loading}>
// //                 {loading
// //                   ? "Please wait..."
// //                   : isRegister
// //                   ? "Create Account"
// //                   : "Sign In"}
// //               </Button>
// //             </form>

// //             <div className="text-center">
// //               <Button
// //                 variant="link"
// //                 onClick={() => setIsRegister(!isRegister)}
// //                 className="text-sm"
// //               >
// //                 {isRegister
// //                   ? "Already have an account? Sign in"
// //                   : "Need an account? Register here"}
// //               </Button>
// //             </div>

// //             {!isRegister && (
// //               <div className="border-t pt-4">
// //                 <p className="text-sm text-muted-foreground text-center mb-3">
// //                   Demo Accounts (password: password123)
// //                 </p>
// //                 <div className="grid gap-2">
// //                   {demoCredentials.map(({ role, email, icon: Icon, color }) => (
// //                     <Button
// //                       key={role}
// //                       variant="outline"
// //                       size="sm"
// //                       onClick={() => {
// //                         setEmail(email);
// //                         setPassword("password123");
// //                       }}
// //                       className="justify-start"
// //                     >
// //                       <Icon className={`h-4 w-4 mr-2 ${color}`} />
// //                       {role.charAt(0).toUpperCase() + role.slice(1)} Demo
// //                     </Button>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // }

// // pages/Login.tsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Stethoscope,
//   Pill,
//   Truck,
//   Eye,
//   EyeOff,
//   HelpCircle,
//   Heart,
//   Shield,
//   Zap,
//   Mail,
//   Lock,
//   User,
//   MapPin,
//   Phone,
//   Building,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// export default function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isRegister, setIsRegister] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     role: "clinic" as "clinic" | "pharmacy" | "rider",
//     organization: "",
//     address: "",
//     phone: "",
//   });

//   const { login, register, loading } = useAuth();
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email || !password) {
//       toast({
//         title: "Missing Information",
//         description: "Please enter both email and password",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       if (isRegister) {
//         if (
//           !formData.name ||
//           !formData.address ||
//           !formData.phone ||
//           !formData.role
//         ) {
//           toast({
//             title: "Incomplete Registration",
//             description: "Please fill in all required fields",
//             variant: "destructive",
//           });
//           return;
//         }
//         await register({
//           email,
//           password,
//           ...formData,
//         });
//         toast({
//           title: "Welcome to MediLink! 🎉",
//           description: "Your account has been created successfully",
//         });
//         await login(email, password);
//       } else {
//         await login(email, password);
//         toast({
//           title: "Welcome back! 👋",
//           description: "Successfully signed in to your account",
//         });
//       }
//       setTimeout(() => navigate("/"), 500);
//     } catch (error) {
//       console.error("Authentication error:", error);
//       toast({
//         title: "Authentication Failed",
//         description:
//           error instanceof Error ? error.message : "Please try again",
//         variant: "destructive",
//       });
//     }
//   };

//   const platformFeatures = [
//     {
//       icon: Heart,
//       title: "Patient Care First",
//       description: "Connecting healthcare providers with essential medications",
//       color: "text-medical-red",
//     },
//     {
//       icon: Shield,
//       title: "Secure & Reliable",
//       description: "HIPAA-compliant platform with end-to-end encryption",
//       color: "text-primary",
//     },
//     {
//       icon: Zap,
//       title: "Lightning Fast",
//       description: "Real-time tracking and instant order notifications",
//       color: "text-tertiary",
//     },
//   ];

//   const roleGuides = [
//     {
//       role: "clinic",
//       title: "Healthcare Providers",
//       steps: [
//         "Upload prescription photos or browse pharmacy inventory",
//         "Add patient details and delivery information",
//         "Track order status in real-time",
//         "Access complete order history and analytics",
//       ],
//       icon: Stethoscope,
//       gradient: "from-primary to-primary-glow",
//     },
//     {
//       role: "pharmacy",
//       title: "Pharmacy Partners",
//       steps: [
//         "Manage comprehensive medication inventory",
//         "Review and approve prescription requests",
//         "Coordinate with delivery partners",
//         "Track revenue and order analytics",
//       ],
//       icon: Pill,
//       gradient: "from-secondary to-secondary-light",
//     },
//     {
//       role: "rider",
//       title: "Delivery Network",
//       steps: [
//         "Browse available delivery opportunities",
//         "Accept orders and plan optimal routes",
//         "Update delivery status in real-time",
//         "Track earnings and delivery metrics",
//       ],
//       icon: Truck,
//       gradient: "from-tertiary to-yellow-300",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
//       {/* Background decorative elements */}
//       <div className="absolute inset-0 opacity-20">
//         <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:30px_30px]"></div>
//       </div>

//       <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
//         <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
//           {/* Left Side - Branding & Features */}
//           <div className="space-y-8 text-white">
//             {/* Logo */}
//             <div className="text-center lg:text-left">
//               <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-glow mb-6">
//                 <div className="bg-white/20 rounded-xl p-3">
//                   <Stethoscope className="h-10 w-10 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-4xl font-bold">MediLink</h1>
//                   <p className="text-white/80 text-sm">Healthcare Connected</p>
//                 </div>
//               </div>

//               <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
//                 Revolutionizing Healthcare
//                 <span className="block text-primary-glow">
//                   Delivery & Access
//                 </span>
//               </h2>

//               <p className="text-xl text-white/90 mb-8 max-w-lg mx-auto lg:mx-0">
//                 Seamlessly connecting clinics, pharmacies, and delivery partners
//                 for faster, more reliable patient care.
//               </p>
//             </div>

//             {/* Features */}
//             <div className="grid gap-4">
//               {platformFeatures.map(
//                 ({ icon: Icon, title, description, color }) => (
//                   <div
//                     key={title}
//                     className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4"
//                   >
//                     <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
//                       <Icon className={`h-5 w-5 ${color}`} />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-white mb-1">{title}</h4>
//                       <p className="text-white/80 text-sm">{description}</p>
//                     </div>
//                   </div>
//                 )
//               )}
//             </div>

//             {/* Platform Guide - Desktop Only */}
//             <div className="hidden lg:block">
//               <div className="flex items-center gap-2 mb-4">
//                 <HelpCircle className="h-5 w-5 text-white/60" />
//                 <p className="text-white/90 font-medium">How It Works</p>
//               </div>
//               <div className="grid gap-3">
//                 {roleGuides.map(({ role, title, icon: Icon, gradient }) => (
//                   <div
//                     key={role}
//                     className={`bg-gradient-to-r ${gradient} bg-opacity-20 backdrop-blur-sm rounded-lg p-4 border border-white/20`}
//                   >
//                     <div className="flex items-center gap-3 mb-2">
//                       <Icon className="h-5 w-5 text-white" />
//                       <span className="font-medium text-white">{title}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Auth Form */}
//           <div className="w-full max-w-md mx-auto">
//             <Card className="bg-white/95 backdrop-blur-lg border-white/20 shadow-strong">
//               <CardHeader className="text-center pb-6">
//                 <CardTitle className="text-3xl font-bold text-foreground mb-2">
//                   {isRegister ? "Join MediLink" : "Welcome Back"}
//                 </CardTitle>
//                 <CardDescription className="text-lg">
//                   {isRegister
//                     ? "Create your account to get started"
//                     : "Sign in to your dashboard"}
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="space-y-6">
//                 <form onSubmit={handleSubmit} className="space-y-5">
//                   {isRegister && (
//                     <>
//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="name"
//                           className="flex items-center gap-2"
//                         >
//                           <User className="h-4 w-4" />
//                           Name/Organization
//                         </Label>
//                         <Input
//                           id="name"
//                           value={formData.name}
//                           onChange={(e) =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               name: e.target.value,
//                             }))
//                           }
//                           placeholder="Enter your name or organization"
//                           className="h-12"
//                           required
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label
//                           id="role-label"
//                           htmlFor="role"
//                           className="flex items-center gap-2"
//                         >
//                           <Shield className="h-4 w-4" />
//                           Account Type
//                         </Label>
//                         <select
//                           id="role"
//                           aria-labelledby="role-label"
//                           title="Account Type"
//                           value={formData.role}
//                           onChange={(e) =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               role: e.target.value as
//                                 | "clinic"
//                                 | "pharmacy"
//                                 | "rider",
//                             }))
//                           }
//                           className="w-full h-12 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent"
//                           required
//                         >
//                           <option value="clinic">🏥 Healthcare Provider</option>
//                           <option value="pharmacy">💊 Pharmacy</option>
//                           <option value="rider">🚚 Delivery Partner</option>
//                         </select>
//                       </div>

//                       {formData.role !== "rider" && (
//                         <div className="space-y-2">
//                           <Label
//                             htmlFor="organization"
//                             className="flex items-center gap-2"
//                           >
//                             <Building className="h-4 w-4" />
//                             Organization
//                           </Label>
//                           <Input
//                             id="organization"
//                             value={formData.organization}
//                             onChange={(e) =>
//                               setFormData((prev) => ({
//                                 ...prev,
//                                 organization: e.target.value,
//                               }))
//                             }
//                             placeholder="Organization or business name"
//                             className="h-12"
//                           />
//                         </div>
//                       )}

//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="address"
//                           className="flex items-center gap-2"
//                         >
//                           <MapPin className="h-4 w-4" />
//                           Address
//                         </Label>
//                         <Input
//                           id="address"
//                           value={formData.address}
//                           onChange={(e) =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               address: e.target.value,
//                             }))
//                           }
//                           placeholder="Complete business address"
//                           className="h-12"
//                           required
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="phone"
//                           className="flex items-center gap-2"
//                         >
//                           <Phone className="h-4 w-4" />
//                           Phone Number
//                         </Label>
//                         <Input
//                           id="phone"
//                           type="tel"
//                           value={formData.phone}
//                           onChange={(e) =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               phone: e.target.value,
//                             }))
//                           }
//                           placeholder="+1 (555) 123-4567"
//                           className="h-12"
//                           required
//                         />
//                       </div>
//                     </>
//                   )}

//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="flex items-center gap-2">
//                       <Mail className="h-4 w-4" />
//                       Email Address
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="Enter your email address"
//                       className="h-12"
//                       required
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="password"
//                       className="flex items-center gap-2"
//                     >
//                       <Lock className="h-4 w-4" />
//                       Password
//                     </Label>
//                     <div className="relative">
//                       <Input
//                         id="password"
//                         type={showPassword ? "text" : "password"}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Enter your password"
//                         className="h-12 pr-12"
//                         required
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? (
//                           <EyeOff className="h-4 w-4 text-muted-foreground" />
//                         ) : (
//                           <Eye className="h-4 w-4 text-muted-foreground" />
//                         )}
//                       </Button>
//                     </div>
//                   </div>

//                   <Button
//                     type="submit"
//                     className="w-full h-12 text-lg font-semibold bg-gradient-hero hover:shadow-glow transition-spring"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <div className="flex items-center gap-2">
//                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                         {isRegister ? "Creating Account..." : "Signing In..."}
//                       </div>
//                     ) : isRegister ? (
//                       "Create Account"
//                     ) : (
//                       "Sign In"
//                     )}
//                   </Button>
//                 </form>

//                 <div className="text-center">
//                   <Button
//                     variant="link"
//                     onClick={() => setIsRegister(!isRegister)}
//                     className="text-primary hover:text-primary-glow transition-smooth"
//                   >
//                     {isRegister
//                       ? "Already have an account? Sign in"
//                       : "New to MediLink? Create account"}
//                   </Button>
//                 </div>

//                 {/* Mobile Platform Guide */}
//                 {!isRegister && (
//                   <div className="lg:hidden border-t pt-6">
//                     <div className="flex items-center justify-center gap-2 mb-4">
//                       <HelpCircle className="h-4 w-4 text-muted-foreground" />
//                       <p className="text-sm font-medium text-muted-foreground">
//                         How MediLink Works
//                       </p>
//                     </div>
//                     <div className="space-y-3">
//                       {roleGuides.map(
//                         ({ role, title, steps, icon: Icon, gradient }) => (
//                           <div
//                             key={role}
//                             className="border rounded-lg p-4 bg-gradient-to-r from-primary-light/30 to-secondary-light/30"
//                           >
//                             <div className="flex items-center gap-2 mb-3">
//                               <Icon className="h-4 w-4 text-primary" />
//                               <span className="font-medium text-sm">
//                                 {title}
//                               </span>
//                             </div>
//                             <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
//                               {steps.map((step, index) => (
//                                 <li key={index}>{step}</li>
//                               ))}
//                             </ul>
//                           </div>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Stethoscope,
  Pill,
  Truck,
  Eye,
  EyeOff,
  HelpCircle,
  Heart,
  Shield,
  Zap,
  Mail,
  Lock,
  User,
  MapPin,
  Phone,
  Building,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "clinic" as "clinic" | "pharmacy" | "rider",
    organization: "",
    address: "",
    phone: "",
  });

  const { login, register, loading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isRegister) {
        if (
          !formData.name ||
          !formData.address ||
          !formData.phone ||
          !formData.role
        ) {
          toast({
            title: "Incomplete Registration",
            description: "Please fill in all required fields",
            variant: "destructive",
          });
          return;
        }
        await register({
          email,
          password,
          ...formData,
        });
        toast({
          title: "Welcome to MediLink! 🎉",
          description: "Your account has been created successfully",
        });
        await login(email, password);
      } else {
        await login(email, password);
        toast({
          title: "Welcome back! 👋",
          description: "Successfully signed in to your account",
        });
      }
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication Failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const platformFeatures = [
    {
      icon: Heart,
      title: "Patient Care First",
      description: "Connecting healthcare providers with essential medications",
      color: "text-medical-red",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "HIPAA-compliant platform with end-to-end encryption",
      color: "text-primary",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time tracking and instant order notifications",
      color: "text-tertiary",
    },
  ];

  const roleGuides = [
    {
      role: "clinic",
      title: "Healthcare Providers",
      steps: [
        "Upload prescription photos or browse pharmacy inventory",
        "Add patient details and delivery information",
        "Track order status in real-time",
        "Access complete order history and analytics",
      ],
      icon: Stethoscope,
      gradient: "from-primary to-primary-glow",
    },
    {
      role: "pharmacy",
      title: "Pharmacy Partners",
      steps: [
        "Manage comprehensive medication inventory",
        "Review and approve prescription requests",
        "Coordinate with delivery partners",
        "Track revenue and order analytics",
      ],
      icon: Pill,
      gradient: "from-secondary to-secondary-light",
    },
    {
      role: "rider",
      title: "Delivery Network",
      steps: [
        "Browse available delivery opportunities",
        "Accept orders and plan optimal routes",
        "Update delivery status in real-time",
        "Track earnings and delivery metrics",
      ],
      icon: Truck,
      gradient: "from-tertiary to-yellow-300",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:30px_30px]"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-4 md:gap-8 items-center">
          {/* Left Side - Branding & Features */}
          <div className="space-y-6 md:space-y-8 text-white">
            {/* Logo */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 md:gap-4 bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 shadow-glow mb-4 md:mb-6">
                <div className="bg-white/20 rounded-xl p-2 md:p-3">
                  <Stethoscope className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                    MediLink
                  </h1>
                  <p className="text-white/80 text-xs md:text-sm">
                    Healthcare Connected
                  </p>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 leading-tight">
                Revolutionizing Healthcare
                <span className="block text-primary-glow">
                  Delivery & Access
                </span>
              </h2>

              <p className="text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0">
                Seamlessly connecting clinics, pharmacies, and delivery partners
                for faster, more reliable patient care.
              </p>
            </div>

            {/* Features */}
            <div className="grid gap-3 md:gap-4">
              {platformFeatures.map(
                ({ icon: Icon, title, description, color }) => (
                  <div
                    key={title}
                    className="flex items-start gap-3 md:gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4"
                  >
                    <div className="bg-white/20 rounded-lg p-1.5 md:p-2 flex-shrink-0">
                      <Icon className={`h-4 w-4 md:h-5 md:w-5 ${color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm md:text-base mb-1">
                        {title}
                      </h4>
                      <p className="text-white/80 text-xs md:text-sm">
                        {description}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Platform Guide - Desktop Only */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-5 w-5 text-white/60" />
                <p className="text-white/90 font-medium">How It Works</p>
              </div>
              <div className="grid gap-3">
                {roleGuides.map(({ role, title, icon: Icon, gradient }) => (
                  <div
                    key={role}
                    className={`bg-gradient-to-r ${gradient} bg-opacity-20 backdrop-blur-sm rounded-lg p-4 border border-white/20`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-5 w-5 text-white" />
                      <span className="font-medium text-white">{title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="bg-white/95 backdrop-blur-lg border-white/20 shadow-strong">
              <CardHeader className="text-center pb-4 md:pb-6">
                <CardTitle className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {isRegister ? "Join MediLink" : "Welcome Back"}
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  {isRegister
                    ? "Create your account to get started"
                    : "Sign in to your dashboard"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5 md:space-y-6">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 md:space-y-5"
                >
                  {isRegister && (
                    <>
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="flex items-center gap-2 text-sm md:text-base"
                        >
                          <User className="h-3 w-3 md:h-4 md:w-4" />
                          Name/Organization
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Enter your name or organization"
                          className="h-10 md:h-12 text-sm md:text-base"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          id="role-label"
                          htmlFor="role"
                          className="flex items-center gap-2 text-sm md:text-base"
                        >
                          <Shield className="h-3 w-3 md:h-4 md:w-4" />
                          Account Type
                        </Label>
                        <select
                          id="role"
                          aria-labelledby="role-label"
                          title="Account Type"
                          value={formData.role}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              role: e.target.value as
                                | "clinic"
                                | "pharmacy"
                                | "rider",
                            }))
                          }
                          className="w-full h-10 md:h-12 rounded-md border border-input bg-background px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm ring-offset-background transition-smooth focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        >
                          <option value="clinic">🏥 Healthcare Provider</option>
                          <option value="pharmacy">💊 Pharmacy</option>
                          <option value="rider">🚚 Delivery Partner</option>
                        </select>
                      </div>

                      {formData.role !== "rider" && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="organization"
                            className="flex items-center gap-2 text-sm md:text-base"
                          >
                            <Building className="h-3 w-3 md:h-4 md:w-4" />
                            Organization
                          </Label>
                          <Input
                            id="organization"
                            value={formData.organization}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                organization: e.target.value,
                              }))
                            }
                            placeholder="Organization or business name"
                            className="h-10 md:h-12 text-sm md:text-base"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label
                          htmlFor="address"
                          className="flex items-center gap-2 text-sm md:text-base"
                        >
                          <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                          Address
                        </Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          placeholder="Complete business address"
                          className="h-10 md:h-12 text-sm md:text-base"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="flex items-center gap-2 text-sm md:text-base"
                        >
                          <Phone className="h-3 w-3 md:h-4 md:w-4" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="+1 (555) 123-4567"
                          className="h-10 md:h-12 text-sm md:text-base"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-2 text-sm md:text-base"
                    >
                      <Mail className="h-3 w-3 md:h-4 md:w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="h-10 md:h-12 text-sm md:text-base pr-0 md:pr-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-2 text-sm md:text-base"
                    >
                      <Lock className="h-3 w-3 md:h-4 md:w-4" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="h-10 md:h-12 text-sm md:text-base pr-10 md:pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 h-6 w-6 md:h-8 md:w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 md:h-12 text-base md:text-lg font-semibold bg-gradient-hero hover:shadow-glow transition-spring"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {isRegister ? "Creating Account..." : "Signing In..."}
                      </div>
                    ) : isRegister ? (
                      "Create Account"
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-primary hover:text-primary-glow transition-smooth text-sm md:text-base"
                  >
                    {isRegister
                      ? "Already have an account? Sign in"
                      : "New to MediLink? Create account"}
                  </Button>
                </div>

                {/* Mobile Platform Guide */}
                {!isRegister && (
                  <div className="lg:hidden border-t pt-4 md:pt-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <HelpCircle className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                      <p className="text-xs md:text-sm font-medium text-muted-foreground">
                        How MediLink Works
                      </p>
                    </div>
                    <div className="space-y-3">
                      {roleGuides.map(
                        ({ role, title, steps, icon: Icon, gradient }) => (
                          <div
                            key={role}
                            className="border rounded-lg p-3 md:p-4 bg-gradient-to-r from-primary-light/30 to-secondary-light/30"
                          >
                            <div className="flex items-center gap-2 mb-2 md:mb-3">
                              <Icon className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                              <span className="font-medium text-xs md:text-sm">
                                {title}
                              </span>
                            </div>
                            <ul className="text-xs md:text-xs text-muted-foreground space-y-1 list-disc list-inside">
                              {steps.map((step, index) => (
                                <li key={index}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
