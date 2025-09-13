import { useState } from "react";
import "./App.css";
const App = () => {
  const [calculator, setCalculator] = useState("basic");
  const [click, setClick] = useState<string | null>(null);

  const [basicStatus, setBasicStatus] = useState(false);
  const [screenValue, setScreenValue] = useState("");
  const [result, setResult] = useState("");

  const [memory, setMemory] = useState(0);

  const [scientificStatus, setScientificStatus] = useState(false);
  const [sScreenValue, setSScreenValue] = useState("");
  const [sResult, setSResult] = useState("");

  const [sMemory, setSMemory] = useState(0);

  const [shift, setShift] = useState(false);
  const [alpha, setAlpha] = useState(false);
  const [deciValue, setDeciValue] = useState(0);
  const [RCL, setRCL] = useState(false);
  const [STO, setSTO] = useState(false);
  const [A, setA] = useState(0);
  const [B, setB] = useState(0);
  const [C, setC] = useState(0);
  const [D, setD] = useState(0);
  const [F, setF] = useState(0);
  const [T, setT] = useState(0);
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [Z, setZ] = useState(0);

  const [DRG, setDRG] = useState("");
  const [rational, setRational] = useState("");
  const [deciFormat, setDeciFormat] = useState("");

  const handleClick = (id: any) => {
    setClick(id);

    if (id === "AC" && !basicStatus) {
      setBasicStatus(true);
    }

    if (basicStatus) {
      if (id === "C") {
        setScreenValue((prev) => prev.slice(0, -1));
      } else if (id === "AC") {
        setScreenValue("");
        setResult("");
      } else if (id === "OFF") {
        setScreenValue("");
        setResult("");
        setBasicStatus(false);
      } else if (id === "±") {
        setScreenValue((prev) => {
          if (!prev) return prev;

          const match = prev.match(/([+\-x÷*\/])?(-?\d+(\.\d+)?)$/);
          if (!match) return prev;

          const operator = match[1] ?? "";
          let number = match[2];
          const before = prev.slice(0, prev.length - match[0].length);

          number = number.startsWith("-") ? number.slice(1) : "-" + number;

          return before + operator + number;
        });
      } else if (id === "=") {
        try {
          const expression = screenValue
            .replaceAll(/x/g, "*")
            .replaceAll(/÷/g, "/")
            .replaceAll(/⋅/g, ".")
            .replaceAll(/(\d+(\.\d+)?)%/g, "($1/100)")
            .replaceAll(/√(\d+(\.\d+)?)/g, "Math.sqrt($1)");

          const evalResult = new Function(`return ${expression}`)();
          setResult(evalResult.toString());
        } catch {
          setResult("Error");
        }
      } else if (id === "MC") {
        setMemory(0);
      } else if (id === "MR") {
        setScreenValue((prev) => prev + memory.toString());
      } else if (id === "M+") {
        setMemory((prev) => Number(prev) + Number(result));
      } else if (id === "M-") {
        setMemory((prev) => Number(prev) - Number(result));
      } else {
        setScreenValue((prev) => prev + id);
      }
    }

    setTimeout(() => {
      setClick(null);
    }, 500);
  };

  const sHandleClick = (id: any) => {
    setClick(id);
    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    if (id === "ON" && !scientificStatus) {
      setScientificStatus(true);
      setDRG("DEG");
      setRational("DECI");
      setDeciFormat("NORM");
      setSScreenValue("");
      setSResult("");
    }

    if (scientificStatus) {
      if (id === "AC") {
        if (shift) {
          setScientificStatus(false);
          setDRG("");
          setRational("");
          setDeciFormat("");
          setShift(false);
          setSScreenValue("");
          setSResult("");
        }
        setSScreenValue("");
        setSResult("");
      } else if (id === "DEL") {
        setSScreenValue((prev) => prev.slice(0, -1));
      } else if (["←", "→", "↓", "↑"].includes(id)) {
      } else if (["SHIFT", "ALPHA", "ON"].includes(id)) {
        //nothing
        disabledKeys();
      } else if (id === "√■") {
        setSScreenValue((prev) => prev + (shift ? `∛(` : alpha ? `mod` : `√(`));
        disabledKeys();
      } else if (id === "x^-1") {
        //done
        setSScreenValue((prev) => prev + (shift ? `!` : `^(-1)`));
        disabledKeys();
      } else if (id === "log■▯") {
        setSScreenValue(
          (prev) => prev + (shift ? `Σ(` : alpha ? `∏(` : `log■▯(`)
        );
        disabledKeys();
      } else if (id === "x²") {
        setSScreenValue((prev) => prev + (shift ? `³` : alpha ? `` : `²`));
        disabledKeys();
      } else if (id === "x^■") {
        //done
        setSScreenValue((prev) => prev + (shift ? `Pow(` : `^`));
        disabledKeys();
      } else if (id === "log") {
        //done
        setSScreenValue((prev) => prev + (shift ? `10^(` : `log(`));
        disabledKeys();
      } else if (id === "ln") {
        //done
        if (STO) {
          setT(Number(sResult));
        } else {
          setSScreenValue(
            (prev) => prev + (shift ? `e^(` : alpha || RCL ? `T` : `ln(`)
          );
        }
        disabledKeys();
      } else if (id === "-") {
        //done
        if (STO) {
          setA(Number(sResult));
        } else {
          setSScreenValue(
            (prev) => prev + (shift ? "∠" : alpha || RCL ? `A` : `-`)
          );
        }
        disabledKeys();
      } else if (id === `° ' "`) {
        //done
        if (STO) {
          setB(Number(sResult));
        } else {
          setSScreenValue(
            (prev) => prev + (shift ? `FACT(` : alpha || RCL ? `B` : `° ' "(`)
          );
        }
        disabledKeys();
      } else if (id === `hyp`) {
        if (STO) {
          setC(Number(sResult));
        } else {
          setSScreenValue(
            (prev) => prev + (shift ? `Abs(` : alpha || RCL ? `C` : ``)
          );
        }
        disabledKeys();
      } else if (["sin", "cos", "tan"].includes(id)) {
        //done
        if (id === "sin") {
          if (STO) {
            setD(Number(sResult));
          } else {
            setSScreenValue(
              (prev) => prev + (shift ? `sin^-1(` : alpha || RCL ? `D` : `sin(`)
            );
          }
        } else if (id === "cos") {
          if (STO) {
            setZ(Number(sResult));
          } else {
            setSScreenValue(
              (prev) => prev + (shift ? `cos^-1(` : alpha || RCL ? `Z` : `cos(`)
            );
          }
        } else if (id === "tan") {
          if (STO) {
            setF(Number(sResult));
          } else {
            setSScreenValue(
              (prev) => prev + (shift ? `tan^-1(` : alpha || RCL ? `F` : `tan(`)
            );
          }
        }
        disabledKeys();
      } else if (id === "RCL") {
        //done
        shift ? setSTO(true) : alpha ? ClrVariables() : setRCL(true);
        disabledKeys();
      } else if (id === "ENG") {
        setSScreenValue((prev) => prev + (shift ? `i` : alpha ? `cot(` : ``));
        disabledKeys();
      } else if (["(", ")"].includes(id)) {
        //dpne
        if (id === ")") {
          setSScreenValue((prev) => prev + (shift ? `,` : alpha ? `ꪎ` : `)`));
        } else {
          setSScreenValue(
            (prev) => prev + (shift ? `%` : alpha ? `cot^-1(` : `(`)
          );
        }
        disabledKeys();
      } else if (id === "M+") {
        //done
        shift
          ? setSMemory(sMemory - Number(sResult))
          : alpha
          ? setSScreenValue((prev) => prev + "m")
          : setSMemory(sMemory + Number(sResult));
        disabledKeys();
      } else if (digits.includes(id)) {
        if (id === "0") {
          setSScreenValue((prev) => prev + (shift ? `Rnd(` : `0`));
        } else {
          setSScreenValue((prev) => prev + id);
        }
        disabledKeys();
      } else if (["x", "÷", "+", "–"].includes(id)) {
        //done
        if (id === "x") {
          setSScreenValue(
            (prev) => prev + (shift ? `P` : alpha ? `GCD(` : `x`)
          );
        } else if (id === "÷") {
          setSScreenValue(
            (prev) => prev + (shift ? `C` : alpha ? `LCM(` : `÷`)
          );
        } else if (id === "+") {
          setSScreenValue(
            (prev) => prev + (shift ? `Pol(` : alpha ? `Ceiling(` : `+`)
          );
        } else if (id === "–") {
          setSScreenValue(
            (prev) => prev + (shift ? `Rec(` : alpha ? `Floor(` : `-`)
          );
        }
        disabledKeys();
      } else if (id === "x10ˣ") {
        //done
        setSScreenValue((prev) => prev + (shift ? `π` : alpha ? `e` : `ᴇ`));
        disabledKeys();
      } else if (id === "⋅") {
        //done
        setSScreenValue(
          (prev) => prev + (shift ? `Rand#` : alpha ? `RandInt(` : `.`)
        );
        disabledKeys();
      } else if (id === "=") {
        try {
          const expression = sScreenValue
            .replaceAll(/A/g, "A")
            .replaceAll(
              /Σ\(\s*([^)]+?)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/g,
              (_, expr, start, end) => `SOF(i => ${expr}, ${start}, ${end})`
            )
            .replaceAll(
              /∏\(\s*([^)]+?)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/g,
              (_, expr, start, end) => `POF(i => ${expr}, ${start}, ${end})`
            )
            .replaceAll(/(\b\w+\b)\^(\d+)/g, "($1 ** $2)")
            .replaceAll(/x/g, "*")
            .replaceAll(/÷/g, "/")
            .replaceAll(/⋅/g, ".")
            .replaceAll(/(\d+(\.\d+)?)%/g, "($1/100)")
            .replaceAll(/∛\((\d+(\.\d+)?)\)/g, "Math.cbrt($1)")
            .replaceAll(/√\((\d+(\.\d+)?)\)/g, "Math.sqrt($1)")
            .replaceAll(
              /(-?\d+)Pow\((-?\d+)\)/g,
              "Math.sign($2) * Math.pow(Math.abs($2), 1 / $1)"
            )
            .replaceAll(/log\((\d+)\)/g, "(Math.log($1))/(Math.log(10))")
            .replaceAll(
              /log■▯\((-?\d+),(-?\d+)\)/g,
              "(Math.log($2))/(Math.log($1))"
            )
            .replaceAll(/(\d+)\²/g, "($1 ** 2)")
            .replaceAll(/(\d+)\³/g, "($1 ** 3)")
            .replaceAll(/(\d+)\^\((-?\d+)\)/g, "($1 ** $2)")
            .replaceAll(/(\d+)!/g, "factorial($1)")
            .replaceAll(/e\^\((-?\d*\.?\d+)\)/g, "Math.exp($1)")
            .replaceAll(/ln\((-?\d*\.?\d+)\)/g, "Math.log($1)")
            .replaceAll(/FACT\(([^)]+)\)/g, "FACT($1)")
            .replaceAll(
              /° ' "\(([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)\)/g,
              "DegMinSec($1, $2, $3)"
            )
            .replaceAll(
              /° ' "\(([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)\)\s*([+\-x*÷/])\s*° ' "\(([-+]?\d*\.?\d+),([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)\)/g,
              "DegMinSecOperation($1, $2, $3, '$4', $5, $6, $7)"
            )
            .replaceAll(/Abs\(([^)]+)\)/g, "Abs($1)")
            .replaceAll(/sin\(([^)]+)\)/g, "Math.sin($1 * Math.PI / 180)")
            .replaceAll(/cos\(([^)]+)\)/g, "Math.cos($1 * Math.PI / 180)")
            .replaceAll(/tan\(([^)]+)\)/g, "Math.tan($1 * Math.PI / 180)")
            .replaceAll(
              /cot\(([^)]+)\)/g,
              "(1 / Math.tan(($1) * Math.PI / 180))"
            )
            .replaceAll(
              /sin\^\-1\s*\(([\s\S]*?)\)/g,
              "(Math.asin($1) * 180 / Math.PI)"
            )
            .replaceAll(
              /cos\^\-1\s*\(([\s\S]*?)\)/g,
              "(Math.acos($1) * 180 / Math.PI)"
            )
            .replaceAll(
              /tan\^\-1\s*\(([\s\S]*?)\)/g,
              "(Math.atan($1) * 180 / Math.PI)"
            )
            .replaceAll(
              /cot\^\-1\s*\(([\s\S]*?)\)/g,
              "Math.atan(1 / ($1)) * 180 / Math.PI"
            )
            .replaceAll(/([^)]+)\%/g, "$1 / 100")
            .replaceAll(/m/g, "sMemory")
            .replaceAll(/(\d+)P(\d+)/g, "nPr($1, $2)")
            .replaceAll(/(\d+)C(\d+)/g, "nCr($1, $2)")
            .replaceAll(/GCD\((\d+),(\d+)\)/g, "GCD($1, $2)")
            .replaceAll(/LCM\((\d+)C(\d+)\)/g, "LCM($1, $2)")
            .replaceAll(
              /GCD\(([\d,]+)\)/g,
              (_, group) => `GCDMultiple(${group})`
            )
            .replaceAll(
              /LCM\(([\d,]+)\)/g,
              (_, group) => `LCMMultiple(${group})`
            )
            .replaceAll(/Pol\((\d+),(\d+)\)/g, "Pol($1, $2)")
            .replaceAll(/Rec\((\d+),(\d+)\)/g, "Rec($1, $2)")
            .replaceAll(/Ceiling\(\s*([^)]+?)\s*\)/g, "Math.ceil($1)")
            .replaceAll(/Floor\(\s*([^)]+?)\s*\)/g, "Math.floor($1)")
            .replaceAll(/Rnd\(([^)]+)\)/g, "Math.round($1)")
            .replaceAll(/Rand#(\d+)/g, "Math.floor(Math.random() * $1)")
            .replaceAll(/Rand#/g, "Math.random()")
            .replaceAll(/RandInt\(([^,]+),([^)]+)\)/g, "RandomInt($1, $2)")
            .replaceAll(/\(([^)]+)\)\s*π/g, "(($1) * Math.PI)")
            .replaceAll(/([+\-]?\d+(?:\.\d+)?)\s*π/g, "($1 * Math.PI)")
            .replaceAll(/π/g, "Math.PI")
            .replaceAll(/\(([^)]+)\)\s*e/g, "(($1) * Math.E)")
            .replaceAll(/([+\-]?\d+(?:\.\d+)?)\s*e/g, "($1 * Math.E)")
            .replaceAll(/\be\b/g, "Math.E")
            .replaceAll(/(\d+(\.\d+)?)ᴇ(-?\d+)/g, "SNotation($1, $3)")
            .replaceAll(/([^)]+)\∠([^)]+)/g, "polarToComplex($1, $2)");
          const evalResult = eval(expression);
          setSResult(evalResult.toString());
        } catch {
          setSResult("Error");
        }
        disabledKeys();
      } else {
        setSScreenValue((prev) => prev + id);
      }
    }

    setTimeout(() => {
      setClick(null);
    }, 500);
  };

  const decimalToFraction = (num: number): string => {
    if (Number.isInteger(num)) return `${num}`; // already whole number

    const str = num.toString();
    const decimalPlaces = str.split(".")[1].length;
    const denominator = Math.pow(10, decimalPlaces);
    const numerator = Math.round(num * denominator);

    // Reduce fraction (find GCD)
    const gcds = (a: number, b: number): number => {
      return b ? gcds(b, a % b) : a;
    };
    const divisor = gcds(numerator, denominator);

    return `${numerator / divisor}/${denominator / divisor}`;
  };

  const disabledKeys = () => {
    setShift(false);
    setAlpha(false);
    if (RCL === true || STO === true) {
      setRCL(false);
      setSTO(false);
    }
  };

  const goRight = () => {
    const element = document.getElementById("right-home");
    if (element) {
      element.scrollIntoView();
    }
  };

  const factorial = (n: any) => {
    if (n < 0) throw new Error("Factorial of negative number is undefined");
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const nPr = (n: any, r: any) => {
    const numerator = factorial(n);
    const denominator = factorial(n - r);
    const result = numerator / denominator;
    return result;
  };

  const nCr = (n: any, r: any) => {
    const numerator = factorial(n);
    const denominator = factorial(r) * factorial(n - r);
    const result = numerator / denominator;
    return result;
  };

  const GCD = (a: any, b: any) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const GCDMultiple = (...nums: any) => {
    return nums.reduce((a: any, b: any) => GCD(a, b));
  };

  const LCM = (a: any, b: any) => {
    return Math.abs(a * b) / GCD(a, b);
  };

  const LCMMultiple = (...nums: any) => {
    return nums.reduce((a: any, b: any) => LCM(a, b));
  };

  const Pol = (a: any, b: any) => {
    const r = Math.sqrt(a ** 2 + b ** 2);
    const t = (Math.atan2(b, a) * 180) / Math.PI;
    return `${r.toFixed(5)} ∠ ${t.toFixed(5)}°`;
  };

  const Rec = (a: any, b: any) => {
    const t = b * (Math.PI / 180);
    const x = a * Math.cos(t);
    const y = a * Math.sin(t);
    return `x = ${x.toFixed(5)} y = ${y.toFixed(5)}`;
  };

  const RandomInt = (a: any, b: any) => {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  };

  const SNotation = (a: any, b: any) => {
    const tens = 10 ** b;
    return `${a * tens}`;
  };

  const FACT = (n: number): string => {
    if (n < 2) return n.toString();

    let result: string[] = [];
    let divisor = 2;

    while (n > 1) {
      let count = 0;
      while (n % divisor === 0) {
        n /= divisor;
        count++;
      }
      if (count > 0) {
        result.push(count > 1 ? `${divisor}^${count}` : `${divisor}`);
      }
      divisor++;
    }

    return result.join(" × ");
  };

  const DegMinSec = (a: any, b: any, c: any) => {
    setDeciValue(DegMinSecDeci(a, b, c));
    return `${a}°${b}'${c}"`;
  };

  const DegMinSecDeci = (a: any, b: any, c: any) => {
    return a + b / 60 + c / 3600;
  };

  const DegMinSecOperation = (
    a: any,
    b: any,
    c: any,
    op: any,
    d: any,
    e: any,
    f: any
  ) => {
    const d1 = DegMinSecDeci(a, b, c);
    const d2 = DegMinSecDeci(d, e, f);
    let totald = 0;

    if (op === "+") {
      totald = d1 + d2;
    } else if (op === "-") {
      totald = d1 - d2;
    } else if (op === "*") {
      totald = d1 * d2;
    } else if (op === "/") {
      totald = d1 / d2;
    }

    if (totald < 0) {
      const td = Math.ceil(totald);
      const tm = Math.ceil((totald - td) * 60);
      const ts = ((totald - td) * 60 - tm) * 60;
      return `${td}°${tm}'${ts}"`;
    } else {
      const td = Math.floor(totald);
      const tm = Math.floor((totald - td) * 60);
      const ts = ((totald - td) * 60 - tm) * 60;
      return `${td}°${tm}'${ts}"`;
    }
  };

  const Abs = (x: number): number => {
    return x < 0 ? -x : x;
  };

  class Complex {
    re: number; // real part
    im: number; // imaginary part

    constructor(re: number, im: number) {
      this.re = re;
      this.im = im;
    }

    toString(): string {
      return `${this.re.toFixed(5)}${this.im >= 0 ? "+" : ""}${this.im.toFixed(
        5
      )}i`;
    }
  }

  const polarToComplex = (r: number, θ: number): Complex => {
    const rad = (θ * Math.PI) / 180;
    return new Complex(r * Math.cos(rad), r * Math.sin(rad));
  };

  const SOF = (f: any, start: any, end: any) => {
    let total = 0;
    for (let i = start; i <= end; i++) {
      total += f(i);
    }
    return total;
  };

  const POF = (f: any, start: any, end: any) => {
    let total = 1;
    for (let i = start; i <= end; i++) {
      total *= f(i);
    }
    return total;
  };

  const ClrVariables = () => {
    setSMemory(0);
    setA(0);
    setB(0);
    setC(0);
    setD(0);
    setF(0);
    setT(0);
    setX(0);
    setY(0);
    setZ(0);
  };

  const JunkShop = () => {
    factorial(9);
    nPr(0, 2);
    nCr(0, 2);
    GCD(0, 2);
    LCM(0, 2);
    GCDMultiple();
    LCMMultiple();
    Pol(0, 2);
    Rec(0, 2);
    SNotation(0, 2);
    RandomInt(0, 2);
    FACT(0);
    DegMinSec(0, 2, 2);
    DegMinSecOperation(0, 2, 2, "+", 2, 2, 2);
    Abs(0);
    SOF(0, 2, 2);
    POF(0, 2, 2);
    JunkShop();
    polarToComplex(0, 2);
    console.log(A, B, C, D, F, T, X, Y, Z, deciValue);
    decimalToFraction;
    // To meet the requirements of not using the variable.
  };

  return (
    <div id="home">
      <div id="left-home">
        <div id="website-title">
          <h1>
            Code
            <br />
            Calc
          </h1>
        </div>
        <div id="button-container">
          <button
            className={calculator === "basic" ? "active" : ""}
            onClick={() => {
              setCalculator("basic");
              goRight();
            }}
          >
            Basic
            <br />
            Calculator
          </button>
          <button
            className={calculator === "scientific" ? "active" : ""}
            onClick={() => {
              setCalculator("scientific");
              goRight();
            }}
          >
            Scientific
            <br />
            Calculator
          </button>
        </div>
      </div>
      <div id="right-home">
        <div id="calculator-container">
          {calculator === "basic" && (
            <div id="basic-calculator">
              <div id="upper-part">
                <div id="name">
                  <p>CASIO</p>
                </div>
                <div id="solar-container">
                  <div id="solar-panel">
                    <div className="square"></div>
                    <div className="square"></div>
                  </div>
                </div>
              </div>
              <div id="screen-container">
                <div id="screen">
                  <div id="uppertext">
                    <p data-placeholder={basicStatus ? "0000000000000" : ""}>
                      {screenValue}
                    </p>
                  </div>
                  <div id="lowertext">
                    <p
                      data-placeholder={
                        basicStatus ? "0000000000000000000" : ""
                      }
                    >
                      {result}
                    </p>
                  </div>
                </div>
              </div>
              <div id="buttons">
                <div id="buttons-1R">
                  <div className="space">
                    <div id="digits">
                      <div id="upper-digit">
                        <p>10</p>
                      </div>
                      <div id="lower-digit">
                        <p>digits</p>
                      </div>
                    </div>
                    <div id="version">
                      <p>SL-310SV</p>
                    </div>
                  </div>
                  <div
                    className={`calbutton ${
                      click === "&radic;" ? "clicked" : ""
                    }`}
                    onClick={() => handleClick("√")}
                  >
                    &radic;
                  </div>
                  <div
                    className={`calbutton ${click === "OFF" ? "clicked" : ""}`}
                    onClick={() => handleClick("OFF")}
                  >
                    OFF
                  </div>
                </div>
                <div id="buttons-2R">
                  <div
                    className={`calbutton ${click === "MC" ? "clicked" : ""}`}
                    onClick={() => handleClick("MC")}
                  >
                    MC
                  </div>
                  <div
                    className={`calbutton ${click === "MR" ? "clicked" : ""}`}
                    onClick={() => handleClick("MR")}
                  >
                    MR
                  </div>
                  <div
                    className={`calbutton ${click === "M-" ? "clicked" : ""}`}
                    onClick={() => handleClick("M-")}
                  >
                    M-
                  </div>
                  <div
                    className={`calbutton ${click === "M+" ? "clicked" : ""}`}
                    onClick={() => handleClick("M+")}
                  >
                    M+
                  </div>
                  <div
                    className={`calbutton ${click === "÷" ? "clicked" : ""}`}
                    onClick={() => handleClick("÷")}
                  >
                    ÷
                  </div>
                </div>
                <div id="buttons-3R">
                  <div
                    className={`calbutton ${click === "%" ? "clicked" : ""}`}
                    onClick={() => handleClick("%")}
                  >
                    %
                  </div>
                  <div
                    className={`calbutton ${click === "7" ? "clicked" : ""}`}
                    onClick={() => handleClick("7")}
                  >
                    7
                  </div>
                  <div
                    className={`calbutton ${click === "8" ? "clicked" : ""}`}
                    onClick={() => handleClick("8")}
                  >
                    8
                  </div>
                  <div
                    className={`calbutton ${click === "9" ? "clicked" : ""}`}
                    onClick={() => handleClick("9")}
                  >
                    9
                  </div>
                  <div
                    className={`calbutton ${click === "x" ? "clicked" : ""}`}
                    onClick={() => handleClick("x")}
                  >
                    x
                  </div>
                </div>
                <div id="buttons-4R">
                  <div
                    className={`calbutton ${click === "±" ? "clicked" : ""}`}
                    onClick={() => handleClick("±")}
                  >
                    ±
                  </div>
                  <div
                    className={`calbutton ${click === "4" ? "clicked" : ""}`}
                    onClick={() => handleClick("4")}
                  >
                    4
                  </div>
                  <div
                    className={`calbutton ${click === "5" ? "clicked" : ""}`}
                    onClick={() => handleClick("5")}
                  >
                    5
                  </div>
                  <div
                    className={`calbutton ${click === "6" ? "clicked" : ""}`}
                    onClick={() => handleClick("6")}
                  >
                    6
                  </div>
                  <div
                    className={`calbutton ${click === "-" ? "clicked" : ""}`}
                    onClick={() => handleClick("-")}
                  >
                    -
                  </div>
                </div>
                <div id="buttons-5R">
                  <div id="buttons-5R1C">
                    <div id="buttons-5R1C1R">
                      <div
                        className={`calbutton red ${
                          click === "C" ? "clicked" : ""
                        }`}
                        onClick={() => handleClick("C")}
                      >
                        C
                      </div>
                      <div
                        className={`calbutton ${
                          click === "1" ? "clicked" : ""
                        }`}
                        onClick={() => handleClick("1")}
                      >
                        1
                      </div>
                      <div
                        className={`calbutton ${
                          click === "2" ? "clicked" : ""
                        }`}
                        onClick={() => handleClick("2")}
                      >
                        2
                      </div>
                      <div
                        className={`calbutton ${
                          click === "3" ? "clicked" : ""
                        }`}
                        onClick={() => handleClick("3")}
                      >
                        3
                      </div>
                    </div>
                    <div id="buttons-5R1C2R">
                      <div
                        className={`calbutton red ${
                          click === "AC" ? "clicked" : ""
                        }`}
                        onClick={() => handleClick("AC")}
                      >
                        AC
                      </div>
                      <div
                        className={`calbutton ${
                          click === "0" ? "clicked" : ""
                        }`}
                        onClick={() => handleClick("0")}
                      >
                        0
                      </div>
                      <div
                        className={`calbutton ${
                          click === "⋅" ? "clicked" : ""
                        }`}
                        onClick={() => handleClick("⋅")}
                      >
                        ⋅
                      </div>
                      <div
                        className={`calbutton ${
                          click === "=" ? "clicked" : ""
                        }`}
                        onClick={() => handleClick("=")}
                      >
                        =
                      </div>
                    </div>
                  </div>
                  <div id="buttons-5R2C">
                    <div
                      className={`calbutton ${click === "+" ? "clicked" : ""}`}
                      onClick={() => handleClick("+")}
                    >
                      +
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {calculator === "scientific" && (
            <div id="scientific-calculator">
              <div id="s-upper-part">
                <div id="s-name">
                  <p>CASIO</p>
                </div>
                <div id="s-solar-container">
                  <div id="s-solar-panel">
                    <div className="square"></div>
                    <div className="square"></div>
                  </div>
                </div>
              </div>
              <div id="s-screen-container">
                <div id="s-screen">
                  <div
                    id="s-uppertext"
                    dangerouslySetInnerHTML={{
                      __html:
                        sScreenValue ||
                        `<p data-placeholder="${
                          scientificStatus ? "work in progress" : ""
                        }"></p>`,
                    }}
                  />
                  <div id="s-lowertext">
                    <p
                      data-placeholder={
                        scientificStatus ? "i love you Karen P :>" : ""
                      }
                    >
                      {sResult}
                    </p>
                  </div>
                </div>
              </div>
              <div id="s-modes">
                <div className="s-modes-container">
                  <div
                    className={`DRG ${DRG === "DEG" ? "active" : ""}`}
                    onClick={() => setDRG("DEG")}
                  >
                    <p>DEG</p>
                  </div>
                  <div
                    className={`DRG ${DRG === "RAD" ? "active" : ""}`}
                    onClick={() => setDRG("RAD")}
                  >
                    <p>RAD</p>
                  </div>
                  <div
                    className={`DRG ${DRG === "GRA" ? "active" : ""}`}
                    onClick={() => setDRG("GRA")}
                  >
                    <p>GRA</p>
                  </div>
                </div>
                <div className="s-modes-container">
                  <div
                    id="s-mode-2"
                    onClick={() =>
                      rational === "DECI"
                        ? setRational("FRAC")
                        : setRational("DECI")
                    }
                  >
                    <p>{rational}</p>
                  </div>
                </div>
                <div className="s-modes-container">
                  <div id="s-format" onClick={() => setDeciFormat("NORM")}>
                    <p>{deciFormat}</p>
                  </div>
                </div>
                <div className="s-modes-container">
                  <div
                    className={`${shift ? "s-shiftkey-active" : ""} ${
                      alpha ? "s-alphakey-active" : ""
                    }`}
                  >
                    <p>{(shift && "S") || (alpha && "A")}</p>
                  </div>
                </div>
              </div>
              <div id="s-body-1">
                <div id="s-body-1-1C">
                  <div id="s-body-1-1C1R">
                    <div className="s-body-1-container">
                      <div
                        className={`s-shiftalpha ${
                          click === "SHIFT" ? "clicked" : ""
                        } ${alpha ? "gray" : ""}`}
                        onClick={() => {
                          sHandleClick("SHIFT");
                          if (scientificStatus) {
                            setShift(!shift);
                            setAlpha(false);
                          }
                        }}
                      >
                        <p>SHIFT</p>
                      </div>
                    </div>
                    <div className="s-body-1-container">
                      <div
                        className={`s-shiftalpha ${
                          click === "ALPHA" ? "clicked" : ""
                        } ${shift ? "gray" : ""}`}
                        onClick={() => {
                          sHandleClick("ALPHA");
                          if (scientificStatus) {
                            setAlpha(!alpha);
                            setShift(false);
                          }
                        }}
                      >
                        <p>ALPHA</p>
                      </div>
                    </div>
                  </div>
                  <div id="s-body-1-1C2R">
                    <div className="s-body-1-container">
                      <div className="s-AS-2">
                        <div
                          className={`s-S ${
                            alpha || !scientificStatus || RCL || STO
                              ? "gray"
                              : ""
                          }`}
                        >
                          <p>SOLVE</p>
                        </div>
                        <div
                          className={`s-A ${
                            shift || !scientificStatus || RCL || STO
                              ? "gray"
                              : ""
                          }`}
                        >
                          <p>=</p>
                        </div>
                      </div>
                      <div
                        className={`s-calbutton2 ${
                          click === "CALC" ? "clicked" : ""
                        } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                        onClick={() => sHandleClick("CALC")}
                      >
                        <p>CALC</p>
                      </div>
                    </div>
                    <div className="s-body-1-container">
                      <div className="s-AS-2">
                        <div
                          className={`s-S ${
                            alpha || !scientificStatus || RCL || STO
                              ? "gray"
                              : ""
                          }`}
                        >
                          <p>
                            (<sup>d</sup>&frasl;<sub>dx</sub>)■
                          </p>
                        </div>
                        <div
                          className={`s-A ${
                            shift || !scientificStatus || RCL || STO
                              ? "gray"
                              : ""
                          }`}
                        >
                          <p style={{ fontSize: "2rem" }}>:</p>
                        </div>
                      </div>
                      <div
                        className={`s-calbutton2 ${
                          click === "∫□□■" ? "clicked" : ""
                        } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                        onClick={() => sHandleClick("∫□□■")}
                      >
                        <p>
                          ∫<sup>□</sup>
                          <sub>□</sub>■
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="s-body-1-2C">
                  <div id="s-body-1-2C1R">
                    <div className="s-body-1-container">
                      <div
                        className={`s-calbutton2 ${
                          click === "←" ? "clicked" : ""
                        } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                        onClick={() => sHandleClick("←")}
                      >
                        <p>←</p>
                      </div>
                    </div>
                    <div className="s-body-1-container">
                      <div
                        className={`s-calbutton2 ${
                          click === "→" ? "clicked" : ""
                        } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                        onClick={() => sHandleClick("→")}
                      >
                        <p>→</p>
                      </div>
                    </div>
                  </div>
                  <div id="s-body-1-2C2R">
                    <div className="s-body-1-container">
                      <div className="s-AS-2">
                        <div
                          className={`s-S ${
                            alpha || !scientificStatus || RCL || STO
                              ? "gray"
                              : ""
                          }`}
                        >
                          <p> </p>
                        </div>
                        <div
                          className={`s-A ${
                            shift || !scientificStatus || RCL || STO
                              ? "gray"
                              : ""
                          }`}
                        >
                          <p> </p>
                        </div>
                      </div>
                      <div
                        className={`s-calbutton2 ${
                          click === "↑" ? "clicked" : ""
                        } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                        onClick={() => sHandleClick("↑")}
                      >
                        <p>↑</p>
                      </div>
                    </div>
                    <div className="s-body-1-container">
                      <div className="s-AS-2">
                        <div
                          className={`s-S ${
                            alpha || !scientificStatus || RCL || STO
                              ? "gray"
                              : ""
                          }`}
                        >
                          <p> </p>
                        </div>
                        <div
                          className={`s-A ${
                            shift || !scientificStatus || RCL || STO
                              ? "gray"
                              : ""
                          }`}
                        >
                          <p> </p>
                        </div>
                      </div>
                      <div
                        className={`s-calbutton2 ${
                          click === "↓" ? "clicked" : ""
                        } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                        onClick={() => sHandleClick("↓")}
                      >
                        <p>↓</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="s-body-1-3C">
                  <div id="s-body-1-3C1R">
                    <div className="s-body-1-container">
                      <div
                        className={`s-calbutton2 ${
                          click === "MODE" ? "clicked" : ""
                        } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                        onClick={() => sHandleClick("MODE")}
                      >
                        <p>MODE</p>
                      </div>
                    </div>
                    <div className="s-body-1-container">
                      <div
                        className={`s-calbutton2 ${
                          click === "ON" ? "clicked" : ""
                        } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                        onClick={() => sHandleClick("ON")}
                      >
                        <p>ON</p>
                      </div>
                    </div>
                  </div>
                  <div id="s-body-1-3C2R">
                    <div className="s-body-1-container">
                      <div className="s-AS-2">
                        <div
                          className={`s-S ${
                            alpha || !scientificStatus || RCL || STO
                              ? "gray"
                              : ""
                          }`}
                        >
                          <p>x!</p>
                        </div>
                        <div
                          className={`s-A ${
                            shift || !scientificStatus || RCL || STO
                              ? "gray"
                              : ""
                          }`}
                        >
                          <p></p>
                        </div>
                      </div>
                      <div
                        className={`s-calbutton2 ${
                          click === "x^-1" ? "clicked" : ""
                        } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                        onClick={() => sHandleClick("x^-1")}
                      >
                        <p>
                          x<sup>-1</sup>
                        </p>
                      </div>
                    </div>
                    <div className="s-body-1-container">
                      <div className="s-AS-2">
                        <div
                          className={`s-S ${
                            alpha || !scientificStatus || RCL || STO
                              ? "gray"
                              : ""
                          }`}
                        >
                          <p>Σ</p>
                        </div>
                        <div
                          className={`s-A ${
                            shift || !scientificStatus || RCL || STO
                              ? "gray"
                              : ""
                          }`}
                        >
                          <p>∏</p>
                        </div>
                      </div>
                      <div
                        className={`s-calbutton2 ${
                          click === "log■▯" ? "clicked" : ""
                        } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                        onClick={() => sHandleClick("log■▯")}
                      >
                        <p>
                          log<sub>■</sub>▯
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="s-body-2">
                <div id="s-body-2-1R">
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>
                          ■<sup>■</sup>&frasl;<sub>□</sub>
                        </p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>÷R</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "■/□" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("■/□")}
                    >
                      <p>
                        <sup>■</sup>&frasl;<sub>□</sub>
                      </p>
                    </div>
                  </div>
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>∛</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>mod</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "√■" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("√■")}
                    >
                      <p>√■</p>
                    </div>
                  </div>
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>x³</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>(■)</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "x²" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("x²")}
                    >
                      <p>x²</p>
                    </div>
                  </div>
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>
                          <sup>■</sup>√□
                        </p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p></p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "x^■" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("x^■")}
                    >
                      <p>
                        x<sup>■</sup>
                      </p>
                    </div>
                  </div>
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>
                          10<sup>■</sup>
                        </p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p></p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "log" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("log")}
                    >
                      <p>log</p>
                    </div>
                  </div>
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>
                          e<sup>■</sup>
                        </p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus ? "gray" : ""
                        }`}
                      >
                        <p>T</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "ln" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("ln")}
                    >
                      <p>ln</p>
                    </div>
                  </div>
                </div>
                <div id="s-body-2-2R">
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>∠</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus ? "gray" : ""
                        }`}
                      >
                        <p>A</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "-" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("-")}
                    >
                      <p>(−)</p>
                    </div>
                  </div>
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>FACT</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus ? "gray" : ""
                        }`}
                      >
                        <p>B</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === `° ' "` ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick(`° ' "`)}
                    >
                      <p style={{ fontSize: "2.2rem" }}>
                        <sub>° ' "</sub>
                      </p>
                    </div>
                  </div>
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>Abs</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus ? "gray" : ""
                        }`}
                      >
                        <p>C</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "hyp" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("hyp")}
                    >
                      <p>hyp</p>
                    </div>
                  </div>
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>
                          sin<sup>-1</sup>
                        </p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus ? "gray" : ""
                        }`}
                      >
                        <p>D</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "sin" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("sin")}
                    >
                      <p>sin</p>
                    </div>
                  </div>
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>
                          cos<sup>-1</sup>
                        </p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus ? "gray" : ""
                        }`}
                      >
                        <p>Z</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "cos" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("cos")}
                    >
                      <p>cos</p>
                    </div>
                  </div>
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>
                          tan<sup>-1</sup>
                        </p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus ? "gray" : ""
                        }`}
                      >
                        <p>F</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "tan" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("tan")}
                    >
                      <p>tan</p>
                    </div>
                  </div>
                </div>
                <div id="s-body-2-3R">
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>STO</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>CLRv</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "RCL" ? "clicked" : ""
                      } ${shift || alpha || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("RCL")}
                    >
                      <p>RCL</p>
                    </div>
                  </div>
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>i</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>cot</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "ENG" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("ENG")}
                    >
                      <p>
                        <sub>ENG</sub>
                      </p>
                    </div>
                  </div>
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>%</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>
                          cot<sup>-1</sup>
                        </p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "(" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("(")}
                    >
                      <p>(</p>
                    </div>
                  </div>
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p style={{ fontSize: "2.5rem" }}>
                          <sup>,</sup>
                        </p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus ? "gray" : ""
                        }`}
                      >
                        <p>x</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === ")" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick(")")}
                    >
                      <p>)</p>
                    </div>
                  </div>
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>
                          a<sup>b</sup>&frasl;<sub>c</sub>⇔<sup>d</sup>
                          <sub>c</sub>
                        </p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus ? "gray" : ""
                        }`}
                      >
                        <p>y</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "S⇔D" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("S⇔D")}
                    >
                      <p>S⇔D</p>
                    </div>
                  </div>
                  <div className="s-body-2-container">
                    <div className="s-AS-2">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>M −</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>M</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton2 ${
                        click === "M+" ? "clicked" : ""
                      } ${shift || alpha ? "gray" : ""}`}
                      onClick={() => sHandleClick("M+")}
                    >
                      <p>M+</p>
                    </div>
                  </div>
                </div>
              </div>
              <div id="s-buttons">
                <div id="s-buttons-1R">
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>CONST</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "7" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("7")}
                    >
                      <p>7</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>CONV</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "8" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("8")}
                    >
                      <p>8</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>Limit</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>∞</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "9" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("9")}
                    >
                      <p>9</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>INS</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "DEL" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("DEL")}
                    >
                      <p>DEL</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>OFF</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "AC" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("AC")}
                    >
                      <p>AC</p>
                    </div>
                  </div>
                </div>
                <div id="s-buttons-2R">
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>MATRIX</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>⊞</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "4" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("4")}
                    >
                      <p>4</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>VECTOR</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "5" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("5")}
                    >
                      <p>5</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>FUNC</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>HELP</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "6" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("6")}
                    >
                      <p>6</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>nPr</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>GCD</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "x" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("x")}
                    >
                      <p>x</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>nCr</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>LCM</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "÷" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("÷")}
                    >
                      <p>÷</p>
                    </div>
                  </div>
                </div>
                <div id="s-buttons-3R">
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>STAT</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "1" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("1")}
                    >
                      <p>1</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>CMPLX</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "2" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("2")}
                    >
                      <p>2</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>DISTR</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "3" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("3")}
                    >
                      <p>3</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>Pol</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>Ceil</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "+" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("+")}
                    >
                      <p>+</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>Rec</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>Floor</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "–" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("–")}
                    >
                      <p>–</p>
                    </div>
                  </div>
                </div>
                <div id="s-buttons-4R">
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>Rnd</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p> </p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "0" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("0")}
                    >
                      <p>0</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>Ran#</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>RanInt</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "⋅" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("⋅")}
                    >
                      <p>⋅</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>π</p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>e</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "x10ˣ" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("x10ˣ")}
                    >
                      <p>x10ˣ</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p>PreAns</p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "Ans" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("Ans")}
                    >
                      <p>Ans</p>
                    </div>
                  </div>
                  <div className="s-button-container">
                    <div className="s-AS">
                      <div
                        className={`s-S ${
                          alpha || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p> </p>
                      </div>
                      <div
                        className={`s-A ${
                          shift || !scientificStatus || RCL || STO ? "gray" : ""
                        }`}
                      >
                        <p> </p>
                      </div>
                    </div>
                    <div
                      className={`s-calbutton ${
                        click === "=" ? "clicked" : ""
                      } ${shift || alpha || RCL || STO ? "gray" : ""}`}
                      onClick={() => sHandleClick("=")}
                    >
                      <p>=</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
