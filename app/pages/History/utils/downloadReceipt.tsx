export interface ReceiptProps {
  customerName: string;
  date: string;
  validFrom: string;
  validTill: string;
  amountPaid: number;
  sessionName: string;
}

export default function downloadReceipt(props: ReceiptProps) {
  const { amountPaid, customerName, date, validFrom, validTill, sessionName } =
    props;

  const canvas = document.createElement("canvas");
  canvas.width = 700;
  canvas.height = 500;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";

  ctx.fillStyle = "#b30000";
  ctx.font = "28px serif";
  ctx.fillText("ERA'S DANCE & FITNESS ARTS", 60, 50);

  ctx.fillStyle = "#000";
  ctx.font = "16px Arial";
  ctx.fillText("Feel the rhythm of life...", 120, 75);

  ctx.font = "16px Arial";
  ctx.fillText(`Date: ${date}`, 500, 110);
  ctx.fillText(`Receipt No: Undefined`, 60, 110);

  ctx.fillText(`Received From: ${customerName}`, 60, 150);
  ctx.fillText(
    `of Rs. ${amountPaid.toLocaleString()} only for ${sessionName}`,
    60,
    180
  );

  ctx.fillText(`Valid from ${validFrom} to ${validTill}`, 60, 240);

  ctx.strokeRect(60, 270, 300, 90);
  ctx.fillText("Total Amt", 70, 300);
  ctx.fillText(amountPaid.toString(), 200, 300);
  ctx.fillText("Amt. Received", 70, 330);
  ctx.fillText(amountPaid.toString(), 200, 330);
  ctx.fillText("Balance Due", 70, 360);
  ctx.fillText("-", 200, 360);

  const loadBrandingImage = () => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const imgWidth = 100;
        const imgHeight = 100;
        ctx.drawImage(img, 500, 370, imgWidth, imgHeight);
        resolve();
      };
      img.onerror = () => {
        ctx.fillStyle = "#aaa";
        ctx.fillRect(500, 370, 100, 100);
        ctx.fillStyle = "#000";
        ctx.fillText("EDFA", 530, 430);
        resolve();
      };
      img.src = "/branding.png";
    });
  };

  const generateDownload = async () => {
    await loadBrandingImage();

    const link = document.createElement("a");
    link.download = `Receipt_${sessionName.replace(
      /\s+/g,
      "_"
    )}_${customerName.replace(/\s+/g, "_")}_${new Date(validFrom)
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  generateDownload();
}
