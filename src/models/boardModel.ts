import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequalize.js";

class Board extends Model {
  public board_id!: number;
  public title!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

Board.init(
  {
    board_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "boards",
      timestamps: false, 
    }
  );
  
  export default Board;
  