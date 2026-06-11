#!/usr/bin/env node

// Calculator CLI
// Supported operations:
//  - addition (add)
//  - subtraction (sub)
//  - multiplication (mul)
//  - division (div)
//  - modulo (mod)
//  - exponentiation/power (pow)
//  - square root (sqrt)
//
// Usage (positional):
//   node src/calculator.js add 2 3
// Usage (flags):
//   node src/calculator.js --op add --a 2 --b 3
// Help:
//   node src/calculator.js --help

function printHelp() {
  console.log(`Calculator CLI

Supports the following operations:
  add   - addition
  sub   - subtraction
  mul   - multiplication
  div   - division
  mod   - modulo (remainder)
  pow   - exponentiation / power
  sqrt  - square root (unary)

Usage (positional):
  node src/calculator.js <op> <a> <b>
  For unary op like sqrt: node src/calculator.js sqrt <a>

Usage (flags):
  node src/calculator.js --op <op> --a <a> --b <b>

Examples:
  node src/calculator.js add 4 5      # -> 9
  node src/calculator.js --op div --a 10 --b 2  # -> 5
  node src/calculator.js pow 2 8      # -> 256
  node src/calculator.js sqrt 9       # -> 3
`);
}

function parseFlags(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      flags.help = true;
    } else if (arg === '--op' && i + 1 < argv.length) {
      flags.op = argv[++i];
    } else if (arg === '--a' && i + 1 < argv.length) {
      flags.a = argv[++i];
    } else if (arg === '--b' && i + 1 < argv.length) {
      flags.b = argv[++i];
    }
  }
  return flags;
}

// New helper functions
function modulo(a, b) {
  if (b === 0) {
    throw new Error('Modulo by zero');
  }
  return a % b;
}

function power(base, exponent) {
  return Math.pow(base, exponent);
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error('Square root of negative number');
  }
  return Math.sqrt(n);
}

function compute(op, a, b) {
  switch (op) {
    case 'add':
    case '+':
      return a + b;
    case 'sub':
    case '-':
      return a - b;
    case 'mul':
    case 'x':
    case 'X':
    case '*':
      return a * b;
    case 'div':
    case '/':
      if (b === 0) {
        throw new Error('Division by zero');
      }
      return a / b;
    case 'mod':
    case '%':
      return modulo(a, b);
    case 'pow':
    case '**':
    case '^':
      return power(a, b);
    case 'sqrt':
      // unary operation: use 'a' as the operand, ignore b
      return squareRoot(a);
    default:
      throw new Error(`Unsupported operation: ${op}`);
  }
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    printHelp();
    process.exit(0);
  }

  const flags = parseFlags(argv);
  if (flags.help) {
    printHelp();
    process.exit(0);
  }

  let op, aStr, bStr;

  // Prefer flags if provided
  if (flags.op || flags.a || flags.b) {
    op = flags.op;
    aStr = flags.a;
    bStr = flags.b;
  } else {
    // positional: op a b (for unary ops like sqrt, b may be undefined)
    op = argv[0];
    aStr = argv[1];
    bStr = argv[2];
  }

  if (!op || aStr === undefined) {
    console.error('Error: missing arguments. Expected: <op> <a> [<b>]');
    printHelp();
    process.exit(2);
  }

  const a = Number(aStr);
  const b = bStr === undefined ? undefined : Number(bStr);
  if (!isFinite(a) || (bStr !== undefined && !isFinite(b))) {
    console.error('Error: operands must be valid numbers');
    process.exit(2);
  }

  try {
    const result = compute(op, a, b);
    // Print result to stdout for scripting use
    console.log(result);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(2);
  }
}

if (require.main === module) {
  main();
}

module.exports = { compute, modulo, power, squareRoot };
