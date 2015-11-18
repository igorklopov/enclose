  // http://octane-benchmark.googlecode.com/svn/latest/index.html
  // Revision 33

  require("./base.js");
  require("./richards.js");
  require("./deltablue.js");
  require("./crypto.js");
  require("./raytrace.js");
  require("./earley-boyer.js");
  require("./regexp.js");
  require("./navier-stokes.js");

  var completed = 0;
  var benchmarks = BenchmarkSuite.CountBenchmarks();
  var success = true;
  var latencyBenchmarks = ["Splay", "Mandreel"];
  var skipBenchmarks =
          typeof skipBenchmarks === "undefined" ? [] : skipBenchmarks;

  function ShowBox(name) {
  }

  function AddResult(name, result) {
    console.log(name + ': ' + result);
  }

  function AddError(name, error) {
    console.log(name + ": " + error.message);
    if (error == "TypedArrayUnsupported") {
      AddResult(name, '<b>Unsupported<\/b>');
    } else if (error == "PerformanceNowUnsupported") {
      AddResult(name, '<b>Timer error<\/b>');
    } else {
      AddResult(name, '<b>Error</b>');
    }
    success = false;
  }

  function AddScore(score) {
    if (success) {
      console.log("Octane Score: " + score);
    } else {
      console.log("Octane Score (incomplete): " + score);
    }
  }

  function Run() {
    console.log("Running Octane...");
    BenchmarkSuite.RunSuites({
      NotifyStart : ShowBox,
      NotifyError : AddError,
      NotifyResult : AddResult,
      NotifyScore : AddScore
    },
    skipBenchmarks);
  }

  function CheckCompatibility() {
    // If no Typed Arrays support, show warning label.
    var hasTypedArrays = typeof Uint8Array != "undefined"
        && typeof Float64Array != "undefined"
        && typeof (new Uint8Array(0)).subarray != "undefined";

    if (!hasTypedArrays) {
      console.log("Typed Arrays not supported");
    }
    Run();
  }

  function Load() {
    setTimeout(CheckCompatibility, 200);
  }

  Load();
