import Barcode from "react-barcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useTheme } from "@/shared/hooks/use-theme";

export function ProductBarcodeCard({ barcode, sku }: { barcode: string; sku: string }) {
  const { theme } = useTheme();

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-sm">Barcode</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2 py-2">
        <div className="rounded-lg bg-white p-3">
          <Barcode
            value={barcode}
            height={50}
            width={1.6}
            fontSize={12}
            background="#ffffff"
            lineColor={theme === "dark" ? "#0b0b0b" : "#0b0b0b"}
          />
        </div>
        <p className="text-muted-foreground text-xs">SKU {sku}</p>
      </CardContent>
    </Card>
  );
}
