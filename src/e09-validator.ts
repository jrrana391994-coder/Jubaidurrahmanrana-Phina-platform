export const PROVENANCE_CLASSES = ["observed","reported","corroborated","inferred","projected","unknown"] as const;
export type Decision = "PASS"|"INCONCLUSIVE";
export type GateDecision = "UNLOCK_NEXT_GATE"|"LOCK_AND_RESEARCH";

export type ExperimentalEvidencePackage = {
  experimentId:string; technologyId:string; researchQuestion:string; claimOrHypothesis:string;
  objective:string; measurand:any[]; kpis:any[]; instrumentation:any[]; calibrationTraceability:Record<string,unknown>;
  units:any[]; rawMeasurements:Array<{value:number;unit:string;[k:string]:unknown}>; rawArtifactRefs:any[];
  environment:Record<string,unknown>; preconditions:Record<string,unknown>; protocolVersion:string;
  procedure:string; operatorOrSystem:string; timestamp:string; uncertainty:Record<string,unknown>;
  controls:Record<string,unknown>; acceptanceCriteria:Record<string,unknown>;
  repeatabilityReplication:Record<string,unknown>; independentCorroboration:Record<string,unknown>;
  analysis:Record<string,unknown>; provenance:Array<{class:string;[k:string]:unknown}>;
  humanSafetyReview:Record<string,unknown>;
};

const nonEmpty=(v:unknown)=>typeof v==="string"&&v.trim().length>0;
const obj=(v:unknown)=>!!v&&typeof v==="object"&&!Array.isArray(v);

export function validateE09Package(p:Partial<ExperimentalEvidencePackage>|null, e08Pass=true) {
  const checks:any[]=[];
  const add=(stage:string,label:string,pass:boolean,detail:unknown={})=>checks.push({stage,label,status:pass?"PASS":"INCONCLUSIVE",detail});
  add("E09-01","E-08 prerequisite",e08Pass);
  add("E09-02","Research identity",!!p&&nonEmpty(p.experimentId)&&nonEmpty(p.technologyId));
  add("E09-03","Claim/hypothesis",!!p&&nonEmpty(p.researchQuestion)&&nonEmpty(p.claimOrHypothesis));
  add("E09-04","Measurand/KPI",!!p&&Array.isArray(p.measurand)&&p.measurand.length>0&&Array.isArray(p.kpis)&&p.kpis.length>0);
  add("E09-05","Acceptance criterion pre-locked",!!p&&obj(p.acceptanceCriteria)&&Object.keys(p.acceptanceCriteria).length>0);
  add("E09-06","Protocol versioned",!!p&&nonEmpty(p.protocolVersion)&&nonEmpty(p.procedure));
  add("E09-07","Safety review",!!p&&obj(p.humanSafetyReview)&&Object.keys(p.humanSafetyReview).length>0);
  add("E09-08","Instrumentation",!!p&&Array.isArray(p.instrumentation)&&p.instrumentation.length>0);
  add("E09-09","Calibration/traceability",!!p&&obj(p.calibrationTraceability)&&Object.keys(p.calibrationTraceability).length>0);
  add("E09-10","Experiment actually performed",!!p&&nonEmpty(p.timestamp)&&nonEmpty(p.operatorOrSystem));
  const rawOk=!!p&&Array.isArray(p.rawMeasurements)&&p.rawMeasurements.length>0&&p.rawMeasurements.every(m=>Number.isFinite(m.value)&&nonEmpty(m.unit));
  const artifactsOk=!!p&&Array.isArray(p.rawArtifactRefs)&&p.rawArtifactRefs.length>0;
  add("E09-11","Raw evidence captured",rawOk&&artifactsOk,{measurementCount:p?.rawMeasurements?.length??0,artifactCount:p?.rawArtifactRefs?.length??0});
  add("E09-12","Raw evidence integrity",rawOk&&artifactsOk);
  add("E09-13","Repeatability/replication",!!p&&obj(p.repeatabilityReplication)&&Object.keys(p.repeatabilityReplication).length>0);
  add("E09-14","Uncertainty",!!p&&obj(p.uncertainty)&&Object.keys(p.uncertainty).length>0);
  const corrOk=!!p&&obj(p.independentCorroboration)&&Object.keys(p.independentCorroboration).length>0;
  add("E09-15","Independent corroboration",corrOk);
  add("E09-16","Analysis reproducible",!!p&&obj(p.analysis)&&Object.keys(p.analysis).length>0);
  const provOk=!!p&&Array.isArray(p.provenance)&&p.provenance.length>0&&p.provenance.every(x=>PROVENANCE_CLASSES.includes(x.class as any));
  add("E09-17","Human technical/provenance review",provOk&&!!p&&obj(p.humanSafetyReview));
  const pass=checks.every(x=>x.status==="PASS")&&nonEmpty(p?.objective)&&nonEmpty(p?.technologyId)&&Array.isArray(p?.units)&&p!.units.length>0&&obj(p?.environment)&&obj(p?.preconditions)&&obj(p?.controls);
  add("E09-18","L2 decision",pass,{claimBoundary:"L2 only for this named research item; no commercial/L3 certification"});
  return {gate:"E-09",status:pass?"PASS":"INCONCLUSIVE" as Decision,decision:pass?"UNLOCK_NEXT_GATE":"LOCK_AND_RESEARCH" as GateDecision,evidenceLevel:pass?"L2":"L1",stageCount:18,checks,claimBoundary:"E-09 does not certify commercial readiness, field safety, mass-production readiness, or L3 evidence."};
}
