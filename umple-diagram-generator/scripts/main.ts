 import { execSync, spawnSync } from "node:child_process";
import { existsSync, copyFileSync, mkdirSync, readdirSync } from "node:fs";
 import { homedir } from "node:os";
 import path from "node:path";
 import process from "node:process";
 
 type CliArgs = {
   inputPath: string | null;
  diagramType: string;
  outputPath: string;
  outputName: string | null;
   suboptions: string[];
   json: boolean;
   help: boolean;
 };
 
 const EXIT_CODES = {
   SUCCESS: 0,
   MISSING_DEPS: 1,
   VALIDATION_FAILED: 2,
   SVG_GENERATION_FAILED: 3,
 } as const;
 
 function printUsage(): void {
   console.log(`Usage:
  # Folder mode (organized output with all files)
  npx -y bun scripts/main.ts --input model.ump --output ./diagrams --name "light-controller"
  
  # Exact path mode (single SVG file only)
  npx -y bun scripts/main.ts --input model.ump --output ./my-diagram.svg
  
  # With options
  npx -y bun scripts/main.ts --input model.ump --output ./diagrams --name "user-auth" --type class-diagram
 
 Options:
   -i, --input <path>       Input .ump file (required)
  -o, --output <path>      Output path: directory for folder mode, or .svg file for exact path mode (required)
  -n, --name <name>        Diagram name for folder mode (optional, triggers folder mode)
  -t, --type <type>        Diagram type: state-machine (default), class-diagram
  -s, --suboption <opt>    Diagram generator suboption (repeatable, state-machine only: hideactions, hideguards, showtransitionlabels, showguardlabels)
   --json                   JSON output
   -h, --help               Show help
 
 Modes:
  Folder mode: When --name is specified or --output is a directory
               Creates organized folder with .ump, .gv, and .svg files
  Exact path:  When --output ends with .svg
               Saves only the SVG to the exact specified path

 Exit Codes:
   0  Success
   1  Missing dependencies (umple or dot)
   2  Umple validation/compilation failed
  3  SVG generation failed or unsupported diagram type`);
 }
 
 function parseArgs(argv: string[]): CliArgs {
   const out: CliArgs = {
     inputPath: null,
    diagramType: "state-machine",
    outputPath: "",
    outputName: null,
     suboptions: [],
     json: false,
     help: false,
   };
 
   for (let i = 0; i < argv.length; i++) {
     const a = argv[i]!;
 
     if (a === "--help" || a === "-h") {
       out.help = true;
       continue;
     }
 
     if (a === "--json") {
       out.json = true;
       continue;
     }
 
     if (a === "--input" || a === "-i") {
       const v = argv[++i];
       if (!v) throw new Error(`Missing value for ${a}`);
       out.inputPath = v;
       continue;
     }
 
    if (a === "--type" || a === "-t") {
      const v = argv[++i];
      if (!v) throw new Error(`Missing value for ${a}`);
      out.diagramType = v;
      continue;
    }

     if (a === "--output" || a === "-o") {
       const v = argv[++i];
       if (!v) throw new Error(`Missing value for ${a}`);
       out.outputPath = v;
       continue;
     }
 
    if (a === "--name" || a === "-n") {
      const v = argv[++i];
      if (!v) throw new Error(`Missing value for ${a}`);
      out.outputName = v;
      continue;
    }

     if (a === "--suboption" || a === "-s") {
       const v = argv[++i];
       if (!v) throw new Error(`Missing value for ${a}`);
       out.suboptions.push(v);
       continue;
     }
 
     if (a.startsWith("-")) {
       throw new Error(`Unknown option: ${a}`);
     }
 
     if (!out.inputPath) {
       out.inputPath = a;
     }
   }
 
   return out;
 }
 
 function commandExists(cmd: string): boolean {
   try {
     execSync(`command -v ${cmd}`, { stdio: "pipe" });
     return true;
   } catch {
     return false;
   }
 }
 
 function checkDependencies(): { umple: boolean; dot: boolean } {
   return {
     umple: commandExists("umple"),
     dot: commandExists("dot"),
   };
 }
 
function getGeneratorFlag(diagramType: string): string | null {
  switch (diagramType) {
    case "state-machine":
      return "GvStateDiagram";
    case "class-diagram":
      return "GvClassDiagram";
    case "java":
      return "Java";
    case "php":
      return "Php";
    case "python":
      return "Python";
    case "validate":
      return null;
    default:
      return null;
  }
}

function runUmple(
  inputPath: string,
  diagramType: string,
  suboptions: string[]):{ 
  success: boolean; output: string } {
  const generator = getGeneratorFlag(diagramType);

  if (!generator && diagramType !== "validate") {
    return {
      success: false,
      output: `Unsupported type: ${diagramType}. Supported: state-machine, class-diagram, java, php, python, validate`,
    };
  }

  const args: string[] = [];
  args.push(inputPath);

  if (generator) {
    args.push("-g", generator);
  }
   
  for (const opt of suboptions) {
    args.push("-s", opt);
  }
   
  const result = spawnSync("umple", args, {
    encoding: "utf-8",
    stdio: ["inherit", "pipe", "pipe"],
  });

  const outputParts = [result.stdout, result.stderr, result.error?.message].filter(
    (value): value is string => Boolean(value && String(value).trim())
  );
  const output = outputParts.join("\n");
   const hasError = result.status !== 0 || 
                   output.includes("Error") || 
                   output.includes("error") || 
                   output.includes("line ");
  
  return {
    success: !hasError,
    output: output.trim(),
  };
}
 
function findGeneratedFiles(
  inputPath: string,
  diagramType: string
): { gv: string | null; svg: string | null } {
  const dir = path.dirname(inputPath);
  const base = path.basename(inputPath, ".ump");

  const gvCandidates = diagramType === "class-diagram"
    ? [path.join(dir, `${base}cd.gv`), path.join(dir, `${base}.gv`)]
    : [path.join(dir, `${base}.gv`)];

  const svgCandidates = diagramType === "class-diagram"
    ? [path.join(dir, `${base}cd.svg`), path.join(dir, `${base}.svg`)]
    : [path.join(dir, `${base}.svg`)];

  const gv = gvCandidates.find((candidate) => existsSync(candidate)) || null;
  const svg = svgCandidates.find((candidate) => existsSync(candidate)) || null;

  return { gv, svg };
}
 
 function convertGvToSvg(gvPath: string, svgPath: string): boolean {
   try {
     execSync(`dot -Tsvg "${gvPath}" -o "${svgPath}"`, { stdio: "pipe" });
     return existsSync(svgPath);
   } catch {
     return false;
   }
 }
 
function generateFolderName(baseName: string | null, diagramType: string): string {
  const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 15).replace(".", "_");
  
  if (baseName) {
    // Sanitize the name
    const sanitized = baseName.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    return `${sanitized}_${timestamp}`;
  }
  
  // Default naming based on diagram type
  const typePrefix = diagramType === "class-diagram" ? "class-diagram" : "state-machine";
  return `${typePrefix}_${timestamp}`;
}

 function main(): void {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printUsage();
    process.exit(EXIT_CODES.SUCCESS);
  }

  if (!args.inputPath || !args.outputPath) {
    console.error("Error: --input and --output are required");
    printUsage();
    process.exit(EXIT_CODES.MISSING_DEPS);
  }

  const inputPath = path.resolve(args.inputPath);
  if (!existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(EXIT_CODES.VALIDATION_FAILED);
  }


  const deps = checkDependencies();
  const isVisualDiagram = ["state-machine", "class-diagram"].includes(args.diagramType);

  if (!deps.umple) {
    console.error("Error: umple CLI not found.");
    process.exit(EXIT_CODES.MISSING_DEPS);
  }

  if (isVisualDiagram && !deps.dot) {
    console.error("Error: Graphviz (dot) is required for visual diagrams.");
    process.exit(EXIT_CODES.MISSING_DEPS);
  }

  const generation = runUmple(inputPath, args.diagramType, args.suboptions);

  if (args.diagramType === "validate") {
    if (args.json) {
      console.log(JSON.stringify({
        success: generation.success,
        output: generation.output,
        type: "validate"
      }, null, 2));
    } else {
      console.log(generation.success ? "Validation Success: Code is valid." : "Validation Failed:\n" + generation.output);
    }
    process.exit(generation.success ? 0 : 2);
  }

  if (!generation.success) {
    if (args.json) {
      console.log(JSON.stringify({ success: false, error: "Generation failed", output: generation.output }, null, 2));
    } else {
      console.error("Umple generation failed:\n" + generation.output);
    }
    process.exit(EXIT_CODES.VALIDATION_FAILED);
  }

  let files = findGeneratedFiles(inputPath, args.diagramType);
  if (isVisualDiagram && !files.svg && files.gv) {
    const svgPath = files.gv.replace(/\.gv$/, ".svg");
    if (convertGvToSvg(files.gv, svgPath)) {
      files.svg = svgPath;
    }
  }

  if (isVisualDiagram && !files.svg) {
    console.error("Error: SVG file was not generated");
    process.exit(EXIT_CODES.SVG_GENERATION_FAILED);
  }

  const outputPath = path.resolve(args.outputPath);
  const isExactPath = outputPath.endsWith(".svg");
  const useFolderMode = args.outputName !== null || !isExactPath;

  if (useFolderMode && !isExactPath) {
    const folderName = generateFolderName(args.outputName, args.diagramType);
    const outputDir = path.join(outputPath, folderName);
    mkdirSync(outputDir, { recursive: true });

    copyFileSync(inputPath, path.join(outputDir, path.basename(inputPath)));
    if (files.svg) copyFileSync(files.svg, path.join(outputDir, path.basename(files.svg)));
    if (files.gv) copyFileSync(files.gv, path.join(outputDir, path.basename(files.gv)));

    if (!isVisualDiagram) {
      const sourceDir = path.dirname(inputPath);
      readdirSync(sourceDir).forEach(f => {
        if (f.endsWith(".java") || f.endsWith(".php") || f.endsWith(".py") || f.endsWith(".cpp")) {
          copyFileSync(path.join(sourceDir, f), path.join(outputDir, f));
        }
      });
    }

    if (args.json) {
      console.log(JSON.stringify({ success: true, mode: "folder", outputDir, type: args.diagramType }, null, 2));
    } else {
      console.log(`Success: Files generated in ${outputDir}`);
    }

  } else {
    if (files.svg) {
      mkdirSync(path.dirname(outputPath), { recursive: true });
      copyFileSync(files.svg, outputPath);
      if (args.json) {
        console.log(JSON.stringify({ success: true, mode: "exact", outputPath }, null, 2));
      } else {
        console.log(outputPath);
      }
    }
  }

  process.exit(EXIT_CODES.SUCCESS);
}

 main();
