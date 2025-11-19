import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Calendar, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import bannerImage from "@/assets/bassem-eldeeb.jpg";

interface VotingData {
  electionLocation?: string;
  eligibility?: string;
  address?: string;
  votingDate?: string;
  committeeNumber?: string;
  citizenNumber?: string;
}

const Index = () => {
  const [nationalId, setNationalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [votingData, setVotingData] = useState<VotingData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nationalId || nationalId.length !== 14) {
      toast.error("الرجاء إدخال رقم قومي صحيح مكون من 14 رقم");
      return;
    }

    setLoading(true);
    setNotFound(false);
    setVotingData(null);

    try {
      const response = await fetch(
        `https://proxy.elections.eg/election?nid=${nationalId}&location=1`
      );
      
      if (!response.ok) {
        throw new Error("فشل في جلب البيانات");
      }

      const data = await response.json();
      
      if (!data || Object.keys(data).length === 0) {
        setNotFound(true);
      } else {
        setVotingData(data);
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
          minHeight: '280px'
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
      <div className="flex-grow container max-w-4xl mx-auto px-4 py-6">
        {/* Search Section */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">استعلام عن بيانات الانتخاب</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-3">
                <label htmlFor="nationalId" className="text-lg font-semibold">
                  الرقم القومي (14 رقم)
                </label>
                <Input
                  id="nationalId"
                  type="text"
                  placeholder="أدخل الرقم القومي"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/\D/g, '').slice(0, 14))}
                  className="text-lg h-12 text-center"
                  maxLength={14}
                  dir="ltr"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-bold"
                disabled={loading}
              >
                {loading ? (
                  "جاري البحث..."
                ) : (
                  <>
                    <Search className="ml-2 h-5 w-5" />
                    استعلام
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {votingData && (
          <div className="space-y-4 animate-in fade-in-50 duration-500">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                  بيانات الانتخاب
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  {votingData.electionLocation && (
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">مكان اللجنة الانتخابية</p>
                        <p className="text-lg font-bold mt-1">{votingData.electionLocation}</p>
                      </div>
                    </div>
                  )}
                  
                  {votingData.address && (
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">العنوان</p>
                        <p className="text-lg font-bold mt-1">{votingData.address}</p>
                      </div>
                    </div>
                  )}

                  {votingData.eligibility && (
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">يحق الانتخاب</p>
                        <p className="text-lg font-bold mt-1">{votingData.eligibility}</p>
                      </div>
                    </div>
                  )}

                  {votingData.votingDate && (
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">تاريخ التصويت</p>
                        <p className="text-lg font-bold mt-1">{votingData.votingDate}</p>
                      </div>
                    </div>
                  )}

                  {votingData.committeeNumber && (
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">رقم اللجنة</p>
                        <p className="text-lg font-bold mt-1">{votingData.committeeNumber}</p>
                      </div>
                    </div>
                  )}

                  {votingData.citizenNumber && (
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">الرقم الانتخابي</p>
                        <p className="text-lg font-bold mt-1">{votingData.citizenNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Not Found Message */}
        {notFound && (
          <Card className="shadow-md border-accent/20 animate-in fade-in-50 duration-500">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <AlertCircle className="h-16 w-16 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">لم يتم العثور على بيانات</h3>
                <p className="text-muted-foreground">
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
