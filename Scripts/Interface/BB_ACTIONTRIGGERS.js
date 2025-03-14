[
    {
        "Type": "Building/*/*/*",
        "Triggers": [
            {
                "Task": "Plan Review Distribution",
                "Status": "Routed for Review",
                "Action": "upload"
            },
            {
                "Task": "Send Documents to Bluebeam",
                "Status": "Send to Bluebeam",
                "Action": "upload"
            },
            {
                "Task": "Send Comment Review to Bluebeam",
                "Status": "Send to Bluebeam",
                "Action": "upload"
            },
            {
                "Task": "Plan Review Distribution",
                "Status": "Routed for Review",
                "Action": "session"
            },
            {
                "Task": "*Ends with 'Review'*",
                "Status": "Assigned",
                "Action": "invite"
            },
            {
                "Task": "Review Consolidation",
                "Status": "Approved",
                "Action": "download",
                "Folder": "Approved Plans",
                "Category": "Approved Plans | APPPL"
            },
            {
                "Task": "Plan Preparation for Issuance",
                "Status": "Retrieve Approved Plans",
                "Action": "download",
                "Folder": "Approved Plans",
                "Category": "Approved Plans | APPPL"
            },
            {
                "Task": "Review Consolidation",
                "Status": "Approved - Pre-site Inspection Required",
                "Action": "download",
                "Folder": "Pre-Construction Plans",
                "Category": "Pre-Construction Plans | PRECONS"
            },
            {
                "Task": "EC Pre-Site",
                "Status": "Retrieve Approved Pre-Construction Plans",
                "Action": "download",
                "Folder": "Pre-Construction Plans",
                "Category": "Pre-Construction Plans | PRECONS"
            },
            {
                "Task": "Review Consolidation",
                "Status": "Generate Comment Sheet",
                "Action": "upload-report",
                "Report": "Comment Sheet",
            },
            {
                "Task": "Application Submittal",
                "Status": "Complete",
                "Action": "upload-report",
                "Report": "Routing Form",
            },
            {
                "Task": "Retrieve Documents from Bluebeam",
                "Status": "Retrieve from Approved Plans",
                "Action": "download",
                "Folder": "Approved Plans",
                "Category": "Approved Plans | APPPL",
            },
            {
                "Task": "Retrieve Documents from Bluebeam",
                "Status": "Retrieve from Pre-construction Plans",
                "Action": "download",
                "Folder": "Pre-Construction Plans",
                "Category": "Pre-Construction Plans | PRECONS",
            },
            {
                "Task": "Retrieve Documents from Bluebeam",
                "Status": "Retrieve from Review Comments",
                "Action": "download",
                "Folder": "Review Comments",
                "Category": "Review Comments | CMTS",
            },
            {
                "Task": "Review Consolidation",
                "Status": "Resubmittal Required",
                "Action": "download",
                "Folder": "Review Comments",
                "Category": "Review Comments | CMTS",
            },
            {
                "Task": "Review Consolidation",
                "Status": "Resubmittal Required",
                "Action": "submittal"
            },
            {
                "Task": "Review Consolidation",
                "Status": "Resubmittal Required",
                "Action": "resubmittal"
            },
            {
                "Task": "Inspections",
                "Status": "091 Hard Hold Revision",
                "Action": "revision"
            },
            {
                "Task": "Inspections",
                "Status": "081 No Hard Hold Revision",
                "Action": "revision"
            }
        ]
    },
    {
        "Type": "Planning/*/*/*",
        "Triggers": []
    },
    {
        "Type": "PublicWorks/Permit/NA/NA",
        "Triggers": [
            {
                "Task": "Plan Review Distribution",
                "Status": "Routed for Review",
                "Action": "upload"
            },
            {
                "Task": "Send Documents to Bluebeam",
                "Status": "Send to Bluebeam",
                "Action": "upload"
            },
            {
                "Task": "Application Submitted",
                "Status": "Create BlueBeam Session",
                "Action": "session"
            },           
            {
                "Task": "Retrieve Documents from Bluebeam",
                "Status": "Retrieve from Root Folder",
                "Action": "download",
                "Folder": ""
            },
            {
                "Task": "Retrieve Documents from Bluebeam",
                "Status": "Retrieve Complete Package",
                "Action": "download",
                "Folder": "Complete Package",
                "Category": "Issued Permit | PWIP | 99",
            }
        ]
    }
]  