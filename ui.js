// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  parts.log.textContent = "窗口 " + (spec.window || 0) + "，样本 " + (spec.samples || []).length + " 个。";

  function draw() {
    let view = null;
    try {
      view = render(spec);
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    (spec.samples || []).forEach(function (at, spot) {
      const row = document.createElement("div");
      row.className = "row";
      const head = document.createElement("span");
      head.textContent = "第 " + (spot + 1) + " 个样本 时刻 " + at;
      row.appendChild(head);
      const mark = document.createElement("span");
      const late = (view.late_positions || []).indexOf(spot + 1) !== -1;
      mark.className = "chip" + (late ? " bad" : " ok");
      mark.textContent = late ? "迟到丢弃" : "进桶";
      row.appendChild(mark);
      parts.stage.appendChild(row);
    });
    parts.legend.textContent = "收尾水位 " + view.watermark + "，已封口桶 " + JSON.stringify(view.sealed)
      + "，迟到 " + view.late + " 条";
    parts.log.textContent = "桶计数 " + JSON.stringify(view.counts);
  }

  const atInput = document.createElement("input");
  atInput.type = "number";
  atInput.value = "9";
  parts.controls.appendChild(atInput);

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "跑一遍";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const addButton = document.createElement("button");
  addButton.textContent = "追加一个时刻";
  addButton.addEventListener("click", function () {
    const next = Number(atInput.value);
    spec.samples = (spec.samples || []).concat([Number.isFinite(next) ? Math.max(0, Math.round(next)) : 0]);
    draw();
  });
  parts.controls.appendChild(addButton);

  const dropButton = document.createElement("button");
  dropButton.textContent = "删最后一个时刻";
  dropButton.addEventListener("click", function () {
    spec.samples = (spec.samples || []).slice(0, Math.max(0, (spec.samples || []).length - 1));
    draw();
  });
  parts.controls.appendChild(dropButton);

  const wideButton = document.createElement("button");
  wideButton.textContent = "窗口加一";
  wideButton.addEventListener("click", function () {
    spec.window = (spec.window || 1) + 1;
    draw();
  });
  parts.controls.appendChild(wideButton);

  draw();
}
