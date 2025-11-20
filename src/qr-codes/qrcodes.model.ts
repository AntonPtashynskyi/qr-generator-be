import { model, Schema, SchemaType } from "mongoose";

interface IQRCode extends Document {
  owner: Schema.Types.ObjectId;
  qr_id: string;
  target_url: string;
  scan_count: number;
  created_at: Date;
}

const userQrCodeSchema = new Schema<IQRCode>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    qr_id: {
      type: String,
      required: true,
    },
    target_url: {
      type: String,
      required: true,
    },
    scan_count: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const QRCodeModel = model<IQRCode>("userQRCodes", userQrCodeSchema);
export default QRCodeModel;
