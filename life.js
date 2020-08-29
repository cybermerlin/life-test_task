/**
 * Распределение живых клеток в начале игры называется первым поколением.
 * Каждое следующее поколение рассчитывается на основе предыдущего по таким правилам:
 * - в пустой (мёртвой) клетке, рядом с которой ровно три живые клетки, зарождается жизнь;
 * - если у живой клетки есть две или три живые соседки, то эта клетка продолжает жить;
 * - в противном случае, если соседей меньше двух или больше трёх, клетка умирает
 *   («от одиночества» или «от перенаселённости»)
 * Игра прекращается, если
 * - на поле не останется ни одной «живой» клетки
 * - конфигурация на очередном шаге в точности (без сдвигов и поворотов) повторит себя же на
 *   одном из более ранних шагов (складывается периодическая конфигурация)
 * - при очередном шаге ни одна из клеток не меняет своего состояния
 *   (складывается стабильная конфигурация; предыдущее правило, вырожденное до одного шага назад)
 */

let mapOfCellsHistory = [],
    countLivings = 0,
    hasChangesOnLastStep = false;

let world = [];
const cntCells = Math.round(Math.random() * 20);


//TODO: draw grid on canvas


// to be or not to be alive?
function getAlive() {
  return Math.round(Math.random());
}

// calculate counter of neighbors
function calcCountNeighbors(ir, ic) {
  let result = 0;

  if (ir)
    result += world[ir-1][ic];
  if (ir+1 < world.length)
    result += world[ir+1][ic];
  if (ic)
    result += world[ir][ic-1];
  if (ic+1 < world[ir].length)
    result += world[ir][ic+1];
  if (ir && ic) {
    result += world[ir-1][ic-1];
    if (ic+1 < world[ir].length)
      result += world[ir-1][ic+1];
    if (ir+1 < world.length)
      result += world[ir+1][ic-1];
    if (ir+1 < world.length && ic+1 < world[ir].length)
      result += world[ir+1][ic+1];
  }

  return result;
}


//#region program
// build n fill the start state of world
while (world.length < cntCells) {
  let row = [];
  while (row.length < cntCells) {
    row.push(getAlive());
  }
  world.push(row);
}


let allowNextTick = true;

// life cycle
function run() {
  console.info(mapOfCellsHistory.length);
  countLivings = 0;
  hasChangesOnLastStep = false;


  //#region calc new state && hash preview state
  let hash = '';
  world.forEach((row, ir) => {
    row.forEach((cell, ic) => {
      hash += cell;

      let newStateCell = cell;
      // if have only 3 alive neighbors, then life will be born.
      if (calcCountNeighbors(ir, ic) === 3)
        newStateCell = 1;
      // will be in an alive state or die if a neighborhood has less 2 or more 3 lives.
      if (![2,3].includes(calcCountNeighbors(ir, ic)))
        newStateCell = 0;

      if (newStateCell) countLivings++;
      if (newStateCell !== cell) hasChangesOnLastStep = true;

      row[ic] = newStateCell;
    });
  });

  // save state
  mapOfCellsHistory.push(hash);
  //#endregion


  console.info(world.map(row => row.join('')).join('\r\n').replace(/(0)/g, '\u2b1c').replace(/(1)/g, '\u2b1b'));

  // check rules
  allowNextTick &= !!countLivings;
  allowNextTick &= !mapOfCellsHistory.some((h, i) => mapOfCellsHistory.some((_h, _i) => _h === h && i !== _i));
  allowNextTick &= hasChangesOnLastStep;

  if (allowNextTick)
    window.setTimeout(run, 7e2);
}

run();
//#endregion
