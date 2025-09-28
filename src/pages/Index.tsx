// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Stethoscope, ArrowRight, Heart, Shield, Zap } from "lucide-react";
// import { Link } from "react-router-dom";

// const Index = () => {
//   return (
//     <div className="min-h-screen bg-gradient-hero">
//       <div className="container mx-auto px-4 py-16">
//         <div className="text-center text-white mb-16">
//           <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-glow mb-8">
//             <div className="bg-white/20 rounded-xl p-3">
//               <Stethoscope className="h-12 w-12 text-white" />
//             </div>
//             <div>
//               <h1 className="text-5xl font-bold">MediLink</h1>
//               <p className="text-white/80">Healthcare Connected</p>
//             </div>
//           </div>

//           <h2 className="text-4xl font-bold mb-6 leading-tight">
//             Revolutionizing Healthcare
//             <span className="block text-primary-glow">Delivery & Access</span>
//           </h2>

//           <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
//             Seamlessly connecting clinics, pharmacies, and delivery partners for
//             faster, more reliable patient care.
//           </p>

//           <Link to="/login">
//             <Button
//               size="lg"
//               className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 h-auto shadow-strong transition-spring"
//             >
//               Get Started Today
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </Button>
//           </Link>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
//           <Card className="bg-white/95 backdrop-blur-md border-white/20 shadow-soft">
//             <CardHeader className="text-center">
//               <div className="bg-gradient-to-br from-medical-red to-red-400 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
//                 <Heart className="h-6 w-6 text-white" />
//               </div>
//               <CardTitle>Patient Care First</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <CardDescription>
//                 Connecting healthcare providers with essential medications,
//                 ensuring patients get what they need, when they need it.
//               </CardDescription>
//             </CardContent>
//           </Card>

//           <Card className="bg-white/95 backdrop-blur-md border-white/20 shadow-soft">
//             <CardHeader className="text-center">
//               <div className="bg-gradient-to-br from-primary to-primary-glow rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
//                 <Shield className="h-6 w-6 text-white" />
//               </div>
//               <CardTitle>Secure & Reliable</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <CardDescription>
//                 HIPAA-compliant platform with end-to-end encryption, protecting
//                 sensitive patient information at every step.
//               </CardDescription>
//             </CardContent>
//           </Card>

//           <Card className="bg-white/95 backdrop-blur-md border-white/20 shadow-soft">
//             <CardHeader className="text-center">
//               <div className="bg-gradient-to-br from-tertiary to-yellow-400 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
//                 <Zap className="h-6 w-6 text-white" />
//               </div>
//               <CardTitle>Lightning Fast</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <CardDescription>
//                 Real-time tracking and instant notifications keep everyone
//                 informed throughout the entire delivery process.
//               </CardDescription>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Stethoscope,
  ArrowRight,
  HeartPulse,
  Shield,
  Clock,
  Camera,
  Package,
  Truck,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const howItWorksSteps = [
    {
      icon: Camera,
      title: "Request Medication",
      description:
        "Clinics upload prescription photos or select from pharmacy inventory.",
    },
    {
      icon: Package,
      title: "Pharmacy Review",
      description:
        "Pharmacies review requests, confirm availability, and create orders.",
    },
    {
      icon: Truck,
      title: "Assign Delivery",
      description:
        "Riders accept orders and start delivery with real-time tracking.",
    },
    {
      icon: CheckCircle,
      title: "Patient Receives",
      description: "Secure, timely delivery directly to healthcare providers.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center text-white mb-8 md:mb-16">
          <div className="inline-flex items-center gap-2 md:gap-4 bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 shadow-glow mb-4 md:mb-8">
            <div className="bg-white/20 rounded-xl p-2 md:p-3">
              <Stethoscope className="h-8 w-8 md:h-12 md:w-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                MediLink
              </h1>
              <p className="text-white/80 text-xs md:text-sm">
                Healthcare Connected
              </p>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-6 leading-tight">
            Revolutionizing Healthcare
            <span className="block text-primary-glow">Delivery & Access</span>
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto">
            Seamlessly connecting clinics, pharmacies, and delivery partners for
            faster, more reliable patient care.
          </p>

          <Link to="/login">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto shadow-strong transition-spring"
            >
              Get Started Today
              <ArrowRight className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto mb-12 md:mb-16">
          <Card className="bg-white/95 backdrop-blur-md border-white/20 shadow-soft">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-br from-medical-red to-red-400 rounded-lg p-2 md:p-3 w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                <HeartPulse className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <CardTitle className="text-base md:text-lg">
                Patient Care First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm md:text-base">
                Connecting healthcare providers with essential medications,
                ensuring patients get what they need, when they need it.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-md border-white/20 shadow-soft">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-br from-primary to-primary-glow rounded-lg p-2 md:p-3 w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                <Shield className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <CardTitle className="text-base md:text-lg">
                Secure & Reliable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm md:text-base">
                HIPAA-compliant platform with end-to-end encryption, protecting
                sensitive patient information at every step.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-md border-white/20 shadow-soft">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-br from-tertiary to-yellow-400 rounded-lg p-2 md:p-3 w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <CardTitle className="text-base md:text-lg">
                Lightning Fast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm md:text-base">
                Real-time tracking and instant notifications keep everyone
                informed throughout the entire delivery process.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="text-center mb-12 md:mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-8">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="space-y-3">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 flex flex-col items-center text-center">
                  <div className="bg-primary/20 rounded-full p-3 md:p-4 mb-3 md:mb-4">
                    <step.icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                  <h4 className="text-base md:text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm md:text-base text-white/90">
                    {step.description}
                  </p>
                </div>
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block mx-auto w-16 h-0.5 bg-white/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
