$("#add-group-form").submit(function(e){
	e.preventDefault();
	$.when(navigator.geolocation.getCurrentPosition(function(position){console.log(position);return position;}), $('#name-input').val()).done(function(position, name){
		alert("lat: " + position.coords.latitude + " also here's the name: " + name);
	});

	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			console.log("lat: " + position.coords.latitude + " and also long: " + position.coords.longitude);
			$.ajax({
				type:"POST",
				url: "/post/",
				dataType: "json",
				data:{
					name: $('name-input').val(),
					location: {
						lat: position.coords.latitude,
						long: position.coords.longitude 
					},
					age: "25"
				}
			});
		});

	}
	else{
		//geolocation is not supported
	}
});