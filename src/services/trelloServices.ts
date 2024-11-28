import "../models/indexModel.js";
import { Board, List, TrelloCard } from "../models/indexModel.js";
import { CustomError } from "../utils/errorHandling/customError.js";
import { HttpStatus } from "../utils/errorHandling/responseErrorCodes.js";
import ActivityLog from "../models/activityLogModel.js";
import {Op,Transaction} from "sequelize";
import { sequelize } from "../sequalize.js";

interface ListData {
    list_id: number;
    title: string;
    position: number;
    cards: CardData[];
  }
  
  interface CardData {
    card_id: number;
    title: string;
    description: string;
    position: number;
  }

export class TrelloServices {
    public static async getAllBoards(): Promise<Array<object>> {
        const boards = await Board.findAll({
        });
        return boards;
    }

    public static async changeBoardTitle(id:number, newTitle:string): Promise<object> {
        if (isNaN(id)) {
            throw new CustomError(HttpStatus.BAD_REQUEST, "Invalid board ID");
        }
        if (!newTitle || typeof newTitle !== "string") {
            throw new CustomError(HttpStatus.BAD_REQUEST, "Title is required and must be a string");
        }
        const board = await Board.findOne({
            where: { board_id: id },
        });

        if (!board) {
            throw new CustomError(HttpStatus.NOT_FOUND, "No such board");
        }
        board.title = newTitle; 
        await board.save();

        return board;
    }

    public static async createBoard(title: string): Promise<object> {
        if (!title || typeof title !== "string") {
            throw new CustomError(HttpStatus.BAD_REQUEST, "Title is required and must be a string");
        }

        const newBoard = await Board.create({
            title,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return newBoard;
    }

    public static async deleteBoard(id: number): Promise<boolean> {
        if (isNaN(id)) {
            throw new CustomError(HttpStatus.BAD_REQUEST, "Invalid board ID");
        }
    
        const board = await Board.findOne({
            where: { board_id: id },
        });
    
        if (!board) {
            throw new CustomError(HttpStatus.NOT_FOUND, "No such board");
        }
    
        const lists = await List.findAll({ where: { board_id: id } });
    
        for (const list of lists) {
            await TrelloCard.destroy({ where: { list_id: list.list_id } });
            await list.destroy();
        }
    
        await board.destroy();
        return true;
    }
    

    public static async getBoardContent(id:number):Promise<Array<object>>{
        const existenceCheck = await Board.findAll({
            where: { board_id: id },
        });
        if (existenceCheck.length === 0) {
            throw new CustomError(HttpStatus.NOT_FOUND, "No such board");
        }
    
        const boardData = await List.findAll({
            where: { board_id: id },
            include: [{
                model: TrelloCard,
                required: false,
            }],
        });
        return boardData;
    }

    public static async updateBoardLists(boardId: number, lists: ListData[]): Promise<void> {
        const t: Transaction = await sequelize.transaction();
        try {
            const board = await Board.findByPk(boardId);
            if (!board) {
                throw new CustomError(HttpStatus.BAD_REQUEST, "Board not found");
            }
            
            for (const listData of lists) {
                const list = await List.findByPk(listData.list_id);
                if (!list) {
                    throw new CustomError(HttpStatus.BAD_REQUEST, `List ${listData.list_id} not found`);
                }
                
                await list.update({
                    title: listData.title,
                    position: listData.position,
                    updated_at: new Date()
                }, { transaction: t });
                
                if (listData.cards && listData.cards.length > 0) {
                    for (const cardData of listData.cards) {
                        const card = await TrelloCard.findByPk(cardData.card_id);
                        if (!card) {
                            throw new CustomError(HttpStatus.BAD_REQUEST, `Card ${cardData.card_id} not found`);
                        }
                        
                        await card.update({
                            title: cardData.title,
                            description: cardData.description,
                            position: cardData.position,
                            updated_at: new Date()
                        }, { transaction: t });
                    }
                }
            }
            
            await t.commit();
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    
    public static async createList(id:number, data:{ title: string; position: number }):Promise<object>{
        if (isNaN(id)) {
            throw new CustomError(HttpStatus.BAD_REQUEST, "Invalid board ID");
        }
        if (!data.title || typeof data.title !== "string") {
            throw new CustomError(HttpStatus.BAD_REQUEST, "Title is required and must be a string");
        }
        if (data.position === undefined || typeof data.position !== "number") {
            throw new CustomError(HttpStatus.BAD_REQUEST, "Position is required and must be a number");
        }
        const board = await Board.findOne({
            where: { board_id: id },
        });

        if (!board) {
            throw new CustomError(HttpStatus.NOT_FOUND, "No such board");
        }
    
        const newList = await List.create({
            board_id: id, 
            title: data.title,
            position: data.position,
            created_at: new Date(), 
            updated_at: new Date(),
        });
        return newList;
    }    
    public static async updateList(id: number, data: { title?: string; position?: number }): Promise<object> {
        const list = await List.findOne({ where: { list_id: id } });

        if (!list) {
            throw new CustomError(HttpStatus.NOT_FOUND, "List not found");
        }

        if (data.title !== undefined) {
            list.title = data.title;
        }
        if (data.position !== undefined) {
            list.position = data.position;
        }

        await list.save();
        return list;
    }

    public static async deleteList(id: number): Promise<boolean> {
        const list = await List.findOne({ where: { list_id: id } });
    
        if (!list) {
            throw new CustomError(HttpStatus.NOT_FOUND, "List not found");
        }
    
        const boardId = list.board_id;
    
        await TrelloCard.destroy({ where: { list_id: id } });
    
        await list.destroy();
    
        const listsToUpdate = await List.findAll({
            where: { board_id: boardId, position: { [Op.gt]: list.position } },
        });
    
        for (const listToUpdate of listsToUpdate) {
            listToUpdate.position -= 1;
            await listToUpdate.save();
        }
    
        return true;
    }
    

    public static async createCard(listId: number, data: { title: string; description?: string; position: number }): Promise<object> {
        const list = await List.findOne({ where: { list_id: listId } });

        if (!list) {
            throw new CustomError(HttpStatus.NOT_FOUND, "List not found");
        }

        const newCard = await TrelloCard.create({
            list_id: listId,
            title: data.title,
            description: data.description || "",
            position: data.position,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return newCard;
    }

    public static async updateCard( cardId: number, data: { listId?: number, title?: string; description?: string; position?: number }): Promise<object> {
        const card = await TrelloCard.findOne({ where: { card_id: cardId } });

        if (!card) {
            throw new CustomError(HttpStatus.NOT_FOUND, "Card not found");
        }

        if (data.listId !== undefined) {
            card.list_id = data.listId;
        }
        if (data.title !== undefined) {
            card.title = data.title;
        }
        if (data.description !== undefined) {
            card.description = data.description;
        }
        if (data.position !== undefined) {
            card.position = data.position;
        }

        await card.save();
        return card;
    }

    public static async deleteCard(cardId: number): Promise<boolean> {
        const card = await TrelloCard.findOne({ where: { card_id: cardId } });
    
        if (!card) {
            throw new CustomError(HttpStatus.NOT_FOUND, "Card not found");
        }
    
        const listId = card.list_id;
    
        const cardPosition = card.position;
    
        await card.destroy();
    
        const cardsToUpdate = await TrelloCard.findAll({
            where: { list_id: listId, position: { [Op.gt]: cardPosition } },
        });
    
        for (const cardToUpdate of cardsToUpdate) {
            cardToUpdate.position -= 1;
            await cardToUpdate.save();
        }
    
        return true;
    }
    

    public static async getActivityLog(): Promise<Array<object>> {
        const logs = await ActivityLog.findAll();
        return logs.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    }
    

    public static async createActivityLog(data: { user_name_and_surname: string; action_type: string; action_details: string }): Promise<object> {
        const log = await ActivityLog.create({
            user_name_and_surname: data.user_name_and_surname,
            action_type: data.action_type,
            action_details: data.action_details,
            created_at: new Date(),
        });
    
        return log;
    }
    
}