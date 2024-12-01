import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequalize.js";

class ActivityLog extends Model {
  public activity_id!: number;
  public user_name_and_surname!: string;
  public action_type!: string;
  public action_details!: string;
  public created_at!: Date;
}

ActivityLog.init(
  {
    activity_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_name_and_surname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    action_type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    action_details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "activity_log",
    timestamps: false,
  }
);

export default ActivityLog;
