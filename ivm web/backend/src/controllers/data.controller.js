import { masterData } from "../services/master.service.js";
import { chartfirstdata, chartseconddata } from "../services/chart.service.js";

export function getMasterData(req, res) {
  res.json(masterData);
}

export function getChart1(req, res) {
  res.json(chartfirstdata);
}

export function getChart2(req, res) {
  res.json(chartseconddata);
}
