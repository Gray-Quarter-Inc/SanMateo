function WasteManagementPlan() {
    this.apiURL = lookup("GREEN_HALO_CONFIG", "URL");

    this.recordID = null;
    this.id = null;
    this.companyName = null;
    this.phone = null;
    this.projectName = null;
    this.email = null;
    this.password = null;
    this.street = null;
    this.apt_suite = null;
    this.city = null;
    this.state = null;
    this.zipcode = null;
    this.projectStartDate = null;
    this.projectEndDate = null;
    this.value = null;
    this.squareFootage = null;
    this.description = null;
    this.projectType = null;
    this.buildingType = null;
    this.permit = null;
    this.wmpNumber = null;
    this.apiKey = lookup("GREEN_HALO_CONFIG", "API_KEY");
    this.permitSqFootage = null;
    this.permitNote = null;
    this.permitValue = null;
    this.permitProjectType = null;


    this.buildHeaders = function () {
        var headers = aa.util.newHashMap();
        //headers.put("Content-Type","application/json");
        //headers.put("Authorization",this.authorization);
        return headers;
    }

    this.buildCreateRequest = function () {
        //var body = {};
        var body = aa.util.newHashMap()

        if (this.recordID != null) body.put("record_id", new String(this.recordID));
        if (this.id != null) body.put("id", new String(this.id));
        if (this.companyName != null) body.put("company_name", new String(this.companyName));
        if (this.phone != null) body.put("phone", new String(this.phone));
        if (this.projectName != null) body.put("project_name", new String(this.projectName));
        if (this.email != null) body.put("email", new String(this.email));
        if (this.password != null) body.put("password", new String(this.password));
        if (this.street != null) body.put("street", new String(this.street));
        if (this.apt_suite != null) body.put("apt_suite", new String(this.apt_suite));
        if (this.city != null) body.put("city", new String(this.city));
        if (this.zipcode != null) body.put("zipcode", this.zipcode);
        if (this.projectStartDate != null) body.put("project_start_date", this.projectStartDate);
        if (this.projectEndDate != null) body.put("project_end_date", this.projectEndDate);
        if (this.value != null) body.put("value", this.value);
        if (this.squareFootage != null) body.put("square_footage", this.squareFootage); else body.put("square_footage", " ");
        if (this.description != null) body.put("description", this.description);
        if (this.projectType != null) body.put("project_type", this.projectType);
        if (this.buildingType != null) body.put("building_type", this.buildingType);
        if (this.permit != null) body.put("permit", this.permit);
        if (this.apiKey != null) body.put("api_key", this.apiKey);
        if (this.permitSqFootage != null) body.put("permit_sq_footage", this.permitSqFootage); else body.put("permit_sq_footage", " ");
        if (this.permitNote != null) body.put("permit_note", this.permitNote);
        if (this.permitValue != null) body.put("permit_value", this.permitValue);
        if (this.permitProjectType != null) body.put("permit_project_type", this.permitProjectType);
        comment(body);


        return body;
    }

    this.buildAddRequest = function () {
        //var body = {};
        var body = aa.util.newHashMap()

        if (this.wmpNumber != null) body.put("wmp_number", this.wmpNumber);
        if (this.permit != null) body.put("permit", this.permit);
        if (this.apiKey != null) body.put("api_key", this.apiKey);
        if (this.squareFootage != null) body.put("square_footage", this.squareFootage); else body.put("square_footage", " ");
        if (this.description != null) body.put("description", this.description);
        if (this.value != null) body.put("value", this.value);
        if (this.projectType != null) body.put("project_type", this.projectType);


        return body;
    }

    this.createProject = function () {
        var method = lookup("GREEN_HALO_CONFIG", "CREATE");
        aa.print(this.buildCreateRequest())
        aa.print(this.apiURL + method)
        return this.sendRequest(this.apiURL + method, this.buildCreateRequest());

    }

    this.addPermit = function () {
        var method = lookup("GREEN_HALO_CONFIG", "ADD");
        return this.sendRequest(this.apiURL + method, this.buildAddRequest());
    }

    this.sendRequest = function (url, body) {
        var result = aa.httpClient.post(url, this.buildHeaders(), body);
        aa.print(body);
        var response = result.getOutput();
        return response;
    }
}
