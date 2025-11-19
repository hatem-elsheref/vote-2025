import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Calendar, FileText, CheckCircle2, AlertCircle, Building2, Users, Map } from "lucide-react";
import { toast } from "sonner";
import bannerImage from "@/assets/bassem-eldeeb.jpg";

interface VotingLocation {
  code: string;
  name: string;
  unparsed_address: string;
  no_of_boxes: string;
  lat: string | null;
  lng: string | null;
  governorate: string;
  police_district: string;
  voting_date: string;
  density: number;
}

interface VotingInfo {
  stage: string;
  date_round_1: string;
  date_round_2: string;
  box_number: string;
  citizen_number: string;
  locations: VotingLocation[];
}

interface StateInfo {
  police_code: string;
  police_name: string;
  gov_code: string;
  gov_name: string;
}

interface RejectionReason {
  code: string;
  description: string;
}

interface ApiResponse {
  api_version: string;
  last_db_update: string;
  status: string;
  ocv_flag: string;
  rejection_reason: RejectionReason;
  state_info: StateInfo;
  voting_info: VotingInfo;
}

const Index = () => {
  const [nationalId, setNationalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nationalId || nationalId.length !== 14) {
      toast.error("الرجاء إدخال رقم قومي صحيح مكون من 14 رقم");
      return;
    }

    setLoading(true);
    setNotFound(false);
    setApiResponse(null);

    try {
      const response = await fetch(
        `/api/election?nid=${nationalId}&location=1`
      );
      
      if (!response.ok) {
        throw new Error("فشل في جلب البيانات");
      }

      const data: ApiResponse = await response.json();
      
      if (!data || data.status !== "SUCCESS" || !data.voting_info) {
        setApiResponse(null);
        setNotFound(true);
        if (data && data.rejection_reason && data.rejection_reason.code !== "0") {
          toast.error(data.rejection_reason.description || "لا يحق الانتخاب");
        }
      } else {
        setApiResponse(data);
        setNotFound(false);
        if (data.rejection_reason && data.rejection_reason.code === "0") {
          toast.success(data.rejection_reason.description || "الرقم القومي له حق الانتخاب");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("حدث خطأ أثناء جلب البيانات");
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Candidate Banner */}
      <div 
        className="relative overflow-hidden shadow-2xl"
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '200px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="container max-w-4xl mx-auto relative z-10 py-8 px-4">
          <div className="flex flex-col items-center justify-center text-white">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-2xl border-4 border-secondary">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-primary text-center">
                باسم صلاح الديب
              </h1>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-bold text-xl shadow-lg">
                  <span className="text-3xl">✋</span>
                  <span>رقم 5</span>
                </div>
              </div>
              <p className="text-center text-muted-foreground font-semibold mt-3 text-sm">
                دائرة مركز قطور - محافظة الغربية
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow container max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-6">
        {/* Search Section */}
        <Card className="mb-4 md:mb-6 shadow-md">
          <CardHeader className="px-3 md:px-6 py-3 md:py-6">
            <CardTitle className="text-center text-lg md:text-xl lg:text-2xl">استعلام عن بيانات الانتخاب</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-4 md:pb-6">
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div className="flex flex-col gap-2 md:gap-3">
                <label htmlFor="nationalId" className="text-base md:text-lg font-semibold">
                  الرقم القومي (14 رقم)
                </label>
                <div className="flex gap-2">
                  <Input
                    id="nationalId"
                    type="text"
                    placeholder="أدخل الرقم القومي"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value.replace(/\D/g, '').slice(0, 14))}
                    className="text-base md:text-lg h-11 md:h-12 text-center flex-1"
                    maxLength={14}
                    dir="ltr"
                  />
                  <Button 
                    type="submit" 
                    className="h-11 md:h-12 px-4 md:px-6 text-base md:text-lg font-bold flex-shrink-0"
                    disabled={loading}
                  >
                    {loading ? (
                      "جاري البحث..."
                    ) : (
                      <>
                        <Search className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                        استعلام
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {apiResponse && apiResponse.status === "SUCCESS" && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Prominent Box Number and Citizen Number - Top Priority */}
            {apiResponse.voting_info && (apiResponse.voting_info.box_number || apiResponse.voting_info.citizen_number) && (
              <Card className="shadow-2xl border-2 border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 dark:from-card dark:via-card dark:to-primary/10">
                <CardContent className="pt-4 pb-4 px-2 md:pt-10 md:pb-10 md:px-6">
                    <div className="grid grid-cols-2 gap-2 md:gap-8">
                      {apiResponse.voting_info.box_number && (
                        <div className="group relative text-center p-2 md:p-8 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 dark:from-primary/20 dark:via-primary/15 dark:to-primary/10 rounded-lg md:rounded-3xl border-2 border-primary/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300">
                          <div className="absolute inset-0 bg-primary/5 rounded-lg md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex flex-col items-center gap-1 md:gap-4">
                            <div className="p-1 md:p-4 bg-primary/20 rounded-full">
                              <FileText className="h-5 w-5 md:h-12 md:w-12 text-primary" />
                            </div>
                            <div>
                              <p className="text-[10px] md:text-base font-bold text-muted-foreground mb-0.5 md:mb-3 uppercase tracking-wide">رقم الصندوق</p>
                              <p className="text-2xl md:text-6xl lg:text-7xl font-black text-primary drop-shadow-lg">{apiResponse.voting_info.box_number}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {apiResponse.voting_info.citizen_number && (
                        <div className="group relative text-center p-2 md:p-8 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 dark:from-primary/20 dark:via-primary/15 dark:to-primary/10 rounded-lg md:rounded-3xl border-2 border-primary/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300">
                          <div className="absolute inset-0 bg-primary/5 rounded-lg md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex flex-col items-center gap-1 md:gap-4">
                            <div className="p-1 md:p-4 bg-primary/20 rounded-full">
                              <Users className="h-5 w-5 md:h-12 md:w-12 text-primary" />
                            </div>
                            <div>
                              <p className="text-[10px] md:text-base font-bold text-muted-foreground mb-0.5 md:mb-3 uppercase tracking-wide">الرقم الانتخابي</p>
                              <p className="text-2xl md:text-6xl lg:text-7xl font-black text-primary drop-shadow-lg">{apiResponse.voting_info.citizen_number}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
            )}

            {/* Eligibility Status */}
            {apiResponse.rejection_reason && (
              <Card className="shadow-lg border-2 border-green-500/30 bg-gradient-to-r from-green-50/80 to-green-100/50 dark:from-green-950/40 dark:to-green-900/30 backdrop-blur-sm">
                <CardContent className="pt-4 pb-4 md:pt-6 md:pb-6 px-4 md:px-6">
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="p-1.5 md:p-2 bg-green-500/20 rounded-full flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 md:h-7 md:w-7 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-bold text-sm md:text-lg lg:text-xl text-green-700 dark:text-green-400 leading-tight">
                        {apiResponse.rejection_reason.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* State Information */}
            {apiResponse.state_info && (
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-border/50">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-3 md:px-6 py-3 md:py-6">
                  <CardTitle className="flex items-center gap-2 md:gap-3 text-primary text-base md:text-lg lg:text-xl">
                    <div className="p-1.5 md:p-2 bg-primary/20 rounded-lg">
                      <Map className="h-4 w-4 md:h-6 md:w-6" />
                    </div>
                    معلومات المنطقة
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 md:pt-6 px-3 md:px-6 pb-4 md:pb-6">
                  <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-2 md:gap-4 p-3 md:p-4 bg-gradient-to-br from-muted/60 to-muted/40 rounded-lg md:rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <Building2 className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs md:text-sm text-muted-foreground mb-1">المحافظة</p>
                        <p className="text-base md:text-lg lg:text-xl font-bold break-words">{apiResponse.state_info.gov_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 md:gap-4 p-3 md:p-4 bg-gradient-to-br from-muted/60 to-muted/40 rounded-lg md:rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <MapPin className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs md:text-sm text-muted-foreground mb-1">المركز</p>
                        <p className="text-base md:text-lg lg:text-xl font-bold break-words">{apiResponse.state_info.police_name}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Voting Information - Locations */}
            {apiResponse.voting_info && (
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-border/50">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-3 md:px-6 py-3 md:py-6">
                  <CardTitle className="flex items-center gap-2 md:gap-3 text-primary text-base md:text-lg lg:text-xl">
                    <div className="p-1.5 md:p-2 bg-primary/20 rounded-lg">
                      <FileText className="h-4 w-4 md:h-6 md:w-6" />
                    </div>
                    أماكن التصويت
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 md:pt-6 px-3 md:px-6 pb-4 md:pb-6">

                  {/* Voting Locations */}
                  {apiResponse.voting_info.locations && apiResponse.voting_info.locations.length > 0 && (
                    <div className="space-y-4 md:space-y-6">
                      {apiResponse.voting_info.locations.map((location, index) => (
                        <Card key={index} className="border-2 border-primary/30 shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/50 bg-gradient-to-br from-card to-primary/5">
                          <CardContent className="pt-4 pb-4 md:pt-6 md:pb-6 px-3 md:px-6">
                            <div className="space-y-3 md:space-y-4">
                              <div className="flex items-start gap-2 md:gap-4 p-3 md:p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg md:rounded-xl border border-primary/20">
                                <div className="p-1.5 md:p-2 bg-primary/20 rounded-lg flex-shrink-0">
                                  <Building2 className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-xs md:text-sm text-muted-foreground mb-1">اسم اللجنة</p>
                                  <p className="text-base md:text-lg lg:text-xl font-bold break-words leading-tight">{location.name}</p>
                                </div>
                              </div>

                              {location.unparsed_address && (
                                <div className="flex items-start gap-2 md:gap-4 p-3 md:p-4 bg-gradient-to-br from-muted/60 to-muted/40 rounded-lg md:rounded-xl border border-border/50">
                                  <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                    <MapPin className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-xs md:text-sm text-muted-foreground mb-1">العنوان</p>
                                    <p className="text-sm md:text-base lg:text-lg font-bold break-words">{location.unparsed_address}</p>
                                  </div>
                                </div>
                              )}

                              {location.voting_date && (
                                <div className="flex items-start gap-2 md:gap-4 p-3 md:p-4 bg-gradient-to-br from-muted/60 to-muted/40 rounded-lg md:rounded-xl border border-border/50">
                                  <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                    <Calendar className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-xs md:text-sm text-muted-foreground mb-1">تاريخ التصويت</p>
                                    <p className="text-sm md:text-base lg:text-lg font-bold break-words">{location.voting_date}</p>
                                  </div>
                                </div>
                              )}

                              {(location.lat && location.lng) && (
                                <div className="flex items-start gap-2 md:gap-4 p-3 md:p-4 bg-gradient-to-br from-muted/60 to-muted/40 rounded-lg md:rounded-xl border border-border/50">
                                  <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                    <MapPin className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-xs md:text-sm text-muted-foreground mb-1">الإحداثيات</p>
                                    <p className="text-xs md:text-sm font-mono font-semibold break-all">
                                      {location.lat}, {location.lng}
                                    </p>
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 md:gap-3 p-2 md:p-3 bg-muted/30 rounded-lg text-xs md:text-sm text-muted-foreground">
                                <span className="font-semibold">المحافظة: {location.governorate}</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="font-semibold">المركز: {location.police_district}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Not Found Message */}
        {notFound && (
          <Card className="shadow-md border-accent/20 animate-in fade-in-50 duration-500">
            <CardContent className="pt-4 md:pt-6 px-4 md:px-6 pb-4 md:pb-6">
              <div className="text-center py-6 md:py-8">
                <AlertCircle className="h-12 w-12 md:h-16 md:w-16 text-accent mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-bold mb-2 px-2">لم يتم العثور على بيانات</h3>
                <p className="text-sm md:text-base text-muted-foreground px-2">
                  الرجاء التأكد من صحة الرقم القومي والمحاولة مرة أخرى
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
