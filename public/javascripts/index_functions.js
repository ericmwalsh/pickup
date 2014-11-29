$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$("#add-group-form").submit(function(e){
	e.preventDefault();
	//console.log(JSON.stringify($('#add-group-form').serializeObject()));

	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			//console.log("lat: " + position.coords.latitude + " and also long: " + position.coords.longitude + " yo check this: " + JSON.stringify($('#add-group-form').serializeObject()));
			var userData = $('#add-group-form').serializeObject();
			userData["latitude"] = position.coords.latitude;
			userData["longitude"] = position.coords.longitude;
			userData["time"] = Date.now();
			$.ajax({
				type:"POST",
				url: "/post/",
				dataType: "json",
				data:userData
			});
		});

	}
	else{
		//geolocation is not supported
	}
});