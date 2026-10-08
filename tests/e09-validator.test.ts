import {validateE09Package} from "./e09-validator";

const base:any={
 experimentId:"EXP-001",technologyId:"RESEARCH-001",researchQuestion:"Can the system meet KPI?",claimOrHypothesis:"The system meets KPI under defined conditions.",
 objective:"Measure the defined KPI.",measurand:[{name:"output",unit:"unit"}],kpis:[{name:"output",target:10}],
 instrumentation:[{id:"I-1"}],calibrationTraceability:{instrument:"I-1",status:"verified"},units:["unit"],
 rawMeasurements:[{value:10,unit:"unit"}],rawArtifactRefs:[{id:"artifact-1",sha256:"example"}],
 environment:{temperature:"controlled"},preconditions:{safe:true},protocolVersion:"v1",procedure:"Defined procedure.",
 operatorOrSystem:"operator/system",timestamp:"2026-10-08T00:00:00Z",uncertainty:{type:"quantitative"},
 controls:{control:"defined"},acceptanceCriteria:{target:10},repeatabilityReplication:{runs:3},
 independentCorroboration:{reviewer:"independent"},analysis:{method:"defined"},
 provenance:[{class:"observed"}],humanSafetyReview:{reviewed:true}
};

function assert(x:boolean,m:string){if(!x)throw new Error(m)}

const valid=validateE09Package(base);
assert(valid.status==="PASS","complete package should pass software schema gate");

const synthetic=validateE09Package({...base,rawArtifactRefs:[]});
assert(synthetic.status==="INCONCLUSIVE","missing raw artifact references must fail closed");

const noUncertainty=validateE09Package({...base,uncertainty:{}});
assert(noUncertainty.status==="INCONCLUSIVE","missing uncertainty must fail closed");

const noCorroboration=validateE09Package({...base,independentCorroboration:{}});
assert(noCorroboration.status==="INCONCLUSIVE","missing corroboration must fail closed");

const badMeasurement=validateE09Package({...base,rawMeasurements:[{value:Number.NaN,unit:"unit"}]});
assert(badMeasurement.status==="INCONCLUSIVE","invalid measurement must fail closed");

console.log("E-09 software validation fixtures PASS");
