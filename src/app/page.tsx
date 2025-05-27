import AdressSearchInput from "@/components/search/search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {


  return (
    <Card className={`p-6 max-w-2xl mx-auto`}>
      <Input />
      <AdressSearchInput />
      <Button>Rechercher</Button>
    </Card>
  )
}
