import express from "express";
import { asyncMiddleware } from "../middlewares/asyncMiddleware.js";
import { TrelloController } from "../controllers/trelloController.js";

const router = express.Router();

router.get("/board", asyncMiddleware(TrelloController.getAllBoards));
router.post("/board", asyncMiddleware(TrelloController.createBoard));
router.put("/board/:id", asyncMiddleware(TrelloController.changeBoardTitle));
router.delete("/board/:id", asyncMiddleware(TrelloController.deleteBoard));
router.put("/board/updateLists/:id", asyncMiddleware(TrelloController.updateBoardLists));

router.get("/board/content/:id", asyncMiddleware(TrelloController.getBoardContent));
router.post("/board/content/:id", asyncMiddleware(TrelloController.createList));
router.put("/board/content/:listId", asyncMiddleware(TrelloController.updateList));
router.delete("/board/content/:listId", asyncMiddleware(TrelloController.deleteList));

router.post("/board/content/list/:listId", asyncMiddleware(TrelloController.createCard));
router.put("/board/content/card/:cardId", asyncMiddleware(TrelloController.updateCard));
router.delete("/board/content/card/:cardId", asyncMiddleware(TrelloController.deleteCard));

router.get("/activity_log", asyncMiddleware(TrelloController.getActivityLog));
router.post("/activity_log", asyncMiddleware(TrelloController.createActivityLog));

export default router;
