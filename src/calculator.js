#!/usr/bin/env node

// Calculator CLI
// Supported operations:
//  - addition (add)
//  - subtraction (sub)
//  - multiplication (mul)
//  - division (div)
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
  add  - addition
  sub  - subtraction
  mul  - multiplication
  div  - division

Usage (positional):
  node src/calculator.js <op> <a> <b>

Usage (flags):
  node src/calculator.js --op <op> --a <a> --b <b>

Examples:
  node src/calculator.js add 4 5      # -> 9
  node src/calculator.js --op div --a 10 --b 2  # -> 5
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
    // positional: op a b
    op = argv[0];
    aStr = argv[1];
    bStr = argv[2];
  }

  if (!op || aStr === undefined || bStr === undefined) {
    console.error('Error: missing arguments. Expected: <op> <a> <b>');
    printHelp();
    process.exit(2);
  }

  const a = Number(aStr);
  const b = Number(bStr);
  if (!isFinite(a) || !isFinite(b)) {
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
