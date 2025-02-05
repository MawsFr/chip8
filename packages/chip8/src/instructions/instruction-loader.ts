import { $00E0 } from "./$00E0.ts";
import { $00EE } from "./$00EE.ts";
import { $1NNN } from "./$1NNN.ts";
import { $2NNN } from "./$2NNN.ts";
import { $3XNN } from "./$3XNN.ts";
import { $4XNN } from "./$4XNN.ts";
import { $5XY0 } from "./$5XY0.ts";
import { $6XNN } from "./$6XNN.ts";
import { $7XNN } from "./$7XNN.ts";
import { $8XY0 } from "./$8XY0.ts";
import { $8XY1 } from "./$8XY1.ts";
import { $8XY2 } from "./$8XY2.ts";
import { $8XY3 } from "./$8XY3.ts";
import { $8XY4 } from "./$8XY4.ts";
import { $8XY5 } from "./$8XY5.ts";
import { $8XY6 } from "./$8XY6.ts";
import { $8XY7 } from "./$8XY7.ts";
import { $8XYE } from "./$8XYE.ts";
import { $9XY0 } from "./$9XY0.ts";
import { $ANNN } from "./$ANNN.ts";
import { $BNNN } from "./$BNNN.ts";
import { $CXNN } from "./$CXNN.ts";
import { $DXYN } from "./$DXYN.ts";
import { $EX9E } from "./$EX9E.ts";
import { $EXA1 } from "./$EXA1.ts";
import { $FX07 } from "./$FX07.ts";
import { $FX0A } from "./$FX0A.ts";
import { $FX15 } from "./$FX15.ts";
import { $FX18 } from "./$FX18.ts";
import { $FX1E } from "./$FX1E.ts";
import { $FX29 } from "./$FX29.ts";
import { $FX33 } from "./$FX33.ts";
import { $FX55 } from "./$FX55.ts";
import { $FX65 } from "./$FX65.ts";
import type { InstructionConfig } from "./instruction.ts";
import { $0000 } from "./$0000.ts";

export abstract class InstructionLoader {
    static loadInstructions = (context: InstructionConfig) => [
        new $00E0(context),
        new $00EE(context),
        new $1NNN(context),
        new $2NNN(context),
        new $3XNN(context),
        new $4XNN(context),
        new $5XY0(context),
        new $6XNN(context),
        new $7XNN(context),
        new $8XY0(context),
        new $8XY1(context),
        new $8XY2(context),
        new $8XY3(context),
        new $8XY4(context),
        new $8XY5(context),
        new $8XY6(context),
        new $8XY7(context),
        new $8XYE(context),
        new $9XY0(context),
        new $ANNN(context),
        new $BNNN(context),
        new $CXNN(context),
        new $DXYN(context),
        new $EX9E(context),
        new $EXA1(context),
        new $FX07(context),
        new $FX0A(context),
        new $FX15(context),
        new $FX18(context),
        new $FX1E(context),
        new $FX29(context),
        new $FX33(context),
        new $FX55(context),
        new $FX65(context),
        new $0000(context),
    ]
}