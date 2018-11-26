import { getRule } from "./validationrules";
import { getBoardInfoByIndex, getArrowRotationLimit } from "../adapter/boardinfo";
import { getEvent } from "../events/events";
import { Game } from "../types";
import "./validation.common";

const commonRules = [
  getRule("TOOMANYBOWSERS", { limit: 0 }),
  getRule("TOOMANYKOOPAS", { limit: 0 }),
  getRule("GATESETUP"),
  getRule("OVERRECOMMENDEDSPACES", { max: 128 }),
];

export function getValidationRulesForBoard(gameID: Game, boardIndex: number) {
  const rules = commonRules.slice(0);
  const boardInfo = getBoardInfoByIndex(gameID, boardIndex);

  const totalArrowsToWrite = getArrowRotationLimit(boardInfo);
  rules.push(getRule("TOOMANYARROWROTATIONS", { limit: totalArrowsToWrite }));

  if (boardIndex === 0) {
    rules.push(getRule("TOOMANYOFEVENT", { event: getEvent("BANK"), high: 2 }));
    rules.push(getRule("TOOMANYBANKS", { limit: 2 }));
    rules.push(getRule("TOOMANYOFEVENT", { event: getEvent("ITEMSHOP"), high: 2 }));
    rules.push(getRule("TOOMANYITEMSHOPS", { limit: 2 }));
    rules.push(getRule("TOOMANYOFEVENT", { event: getEvent("BOO"), high: 1 }));

    // TODO: gamemasterplc: @PartyPlanner64 replace 0x323AAC in ROM with a NOP if you want more boos
    rules.push(getRule("TOOMANYBOOS", { limit: 1 }));
    rules.push(getRule("TOOMANYGATES", { limit: 2 }));

    // TODO: gamemasterplc: if you want to fix being able to pick up stars with few of them @PartyPlanner64 overwrite rom offset 0x320058 with all zeroes
    rules.push(getRule("BADSTARCOUNT", { low: 8, high: 8 }));

    // No longer needed? See MP3 onAfterOverwrite.
    //rules.push(getRule("TOOFEWBLUESPACES", { low: 14 }));
    //rules.push(getRule("TOOFEWREDSPACES", { low: 1 }));
  }
  return rules;
}