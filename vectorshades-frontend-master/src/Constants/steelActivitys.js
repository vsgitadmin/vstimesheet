const steelActivities = {
  "GENERAL-ACTIVITIES": {
    "Grid Model": ["Grid Modelling", "Grid Model Checking"],
    "Grid Model Rework": ["Grid Model Correction", "Grid Final Checking"],
    "Member-Stick Input": ["Member-Stick Modelling", "Member-Stick Model Checking"],
    "Member-Stick Input Rework": ["Member-Stick Model Correction", "Member-Stick Final Checking"]
  },

  "OFA-ACTIVITIES": {
    "OFA-Anchor Bolt Model": ["AB Modelling", "AB Checking"],
    "OFA-Anchor Bolt Rework": ["AB Model Correction", "AB Model Final Checking"],
    "OFA-Embed Model": ["Embed Modelling", "Embed Checking"],
    "OFA-Embed Rework": ["Embed Model Correction", "Embed Model Final Checking"],
    "OFA-Main Steel Model": ["Main Steel Modelling", "Main Steel Checking"],
    "OFA-Main Steel Rework": ["Main Steel Model Correction", "Main Steel Model Final Checking"],
    "OFA-Misc Steel Model": ["Misc Steel Modelling", "Misc Steel Checking"],
    "OFA-Misc Steel Rework": ["Misc Steel Model Correction", "Misc Steel Model Final Checking"],
    "DELIVERABLE FINALIZATION": ["OFA-Main Steel Package", "OFA-Misc Steel Package"],
    "OFA-Anchor Bolt Detailing": [
      "AB Detail Sheets",
      "E-Sheet & Section Details",
      "AB Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "OFA-Anchor Bolt Detailing Rework": [
      "AB Detail Sheets",
      "E-Sheet & Section Details",
      "AB Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "OFA-Embeds Detailing": [
      "Embed Detail Sheets",
      "E-Sheet & Section Details",
      "Embed Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "OFA-Embeds Detailing Rework": [
      "Embed Detail Sheets",
      "E-Sheet & Section Details",
      "Embed Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "OFA-Main Steel Detailing": [
      "Main Steel Detail Sheets",
      "E-Sheet & Section Details",
      "Main Steel Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "OFA-Main Steel Detailing Rework": [
      "Main Steel Detail Sheets",
      "E-Sheet & Section Details",
      "Main Steel Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "OFA-Misc Steel Detailing": [
      "Misc Steel Detail Sheets",
      "E-Sheet & Section Details",
      "Misc Steel Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "OFA-Misc Steel Detailing Rework": [
      "Misc Steel Detail Sheets",
      "E-Sheet & Section Details",
      "Misc Steel Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ]
  },

  "FAB-ACTIVITIES": {
    "FAB-Anchor Bolt Model": ["AB Modelling", "AB Checking"],
    "FAB-Anchor Bolt Rework": ["AB Model Correction", "AB Model Final Checking"],
    "FAB-Embed Model": ["Embed Modelling", "Embed Checking"],
    "FAB-Embed Rework": ["Embed Model Correction", "Embed Model Final Checking"],
    "FAB-Main Steel Model": ["Main Steel Modelling", "Main Steel Checking"],
    "FAB-Main Steel Rework": ["Main Steel Model Correction", "Main Steel Model Final Checking"],
    "FAB-Misc Steel Model": ["Misc Steel Modelling", "Misc Steel Checking"],
    "FAB-Misc Steel Rework": ["Misc Steel Model Correction", "Misc Steel Model Final Checking"],
    "DELIVERABLE FINALIZATION": ["FAB-Main Steel Package", "FAB-Misc Steel Package"],
    "FAB-Anchor Bolt Detailing": [
      "AB Detail Sheets",
      "E-Sheet & Section Details",
      "AB Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "FAB-Anchor Bolt Detailing Rework": [
      "AB Detail Sheets",
      "E-Sheet & Section Details",
      "AB Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "FAB-Embeds Detailing": [
      "Embed Detail Sheets",
      "E-Sheet & Section Details",
      "Embed Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "FAB-Embeds Detailing Rework": [
      "Embed Detail Sheets",
      "E-Sheet & Section Details",
      "Embed Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "FAB-Main Steel Detailing": [
      "Main Steel Detail Sheets",
      "E-Sheet & Section Details",
      "Main Steel Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "FAB-Main Steel Detailing Rework": [
      "Main Steel Detail Sheets",
      "E-Sheet & Section Details",
      "Main Steel Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "FAB-Misc Steel Detailing": [
      "Misc Steel Detail Sheets",
      "E-Sheet & Section Details",
      "Misc Steel Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "FAB-Misc Steel Detailing Rework": [
      "Misc Steel Detail Sheets",
      "E-Sheet & Section Details",
      "Misc Steel Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ]
  },

  "CO-ACTIVITIES": {
    "Co# Steel Model for Fab": ["Co# Steel Modelling", "Co# Steel Checking"],
    "Co# Steel Model for Fab-Rework": ["Co# Steel Model Correction", "Co# Steel Model Final Checking"],
    "Co# Steel Detailing for Fab": [
      "Co# Steel Detail Sheets",
      "E-Sheet & Section Details",
      "Co# Steel Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "Co# Steel Detailing for Fab-Rework": [
      "Co# Steel Detail Sheets",
      "E-Sheet & Section Details",
      "Co# Steel Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ],
    "Co# Steel Detailing for OFA": [
      "Main Steel Detail Sheets",
      "E-Sheet & Section Details",
      "Main Steel Detail Sheets Checking",
      "E-Sheet & Section Details Checking",
      "Gathers Sheet",
      "MISC Steel Detail Sheets",
      "MISC Steel Detail Sheets Checking",
      "MISC E-Sheet & Section Details",
      "MISC E-Sheet & Section Details Checking",
      "Gather Sheets Detailing",
      "Gather Sheets Checking"
    ]
  },

  "QAQC-ACTIVITIES": {
    "QA/QC_OFA": ["QAQC Back comment review"],
    "QA/QC_FAB": ["QAQC Back comment review"],
    "QA/QC_Re-approval": ["QAQC Back comment review"]
  },

  "OTHER-ACTIVITIES": {
    "Coordination": [""],
    "Deliverable Finalization": [""],
    "Documentation": ["Log", "CO preparation", "RFI", "Sketch"],
    "Job Related Meeting": [""],
    "Design Calculation": [""],
    "Job Studies": [""],
    "Training": [""],
    "Model Review": [""]
  },

  "GENERAL-MANAGEMENT-ACTIVITIES": {
    "Planning & organizing": [""],
    "Coordination": [""],
    "Administrator": [""],
    "Others": [""],
    "Meetings": [""]
  }
};

export default steelActivities;
