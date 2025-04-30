function getDocumentASI(documentModel, subGroupName, fieldName) {
	templateObj = documentModel.getTemplate();
	var templateGroups = templateObj.getTemplateForms(); //ArrayList
	if (!(templateGroups == null || templateGroups.size() == 0)) {
		thisGroup = templateGroups.get(0);
		var subGroups = templateGroups.get(0).getSubgroups();
		for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
			var subGroup = subGroups.get(subGroupIndex);
			if (subGroup.getSubgroupName() == subGroupName) {
				var fArray = new Array();
				var fields = subGroup.getFields();
				for (var fieldIndex = 0; fieldIndex < fields.size(); fieldIndex++) {
					var field = fields.get(fieldIndex);
					fArray[field.getDisplayFieldName()] = field.getDefaultValue();
					if(field.getDisplayFieldName().toString().toUpperCase()==fieldName.toString().toUpperCase()) {
						return field.getDefaultValue();					
					}
				}
			}
		}
	}
}