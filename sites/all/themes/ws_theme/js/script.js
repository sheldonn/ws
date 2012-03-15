(function($){
	$(document).ready(function(){
		if($('#map').length > 0){
			init_map();
		}
		
		
		if($('#show').length > 0){
			//var img = $('.field-name-field-prod-image .field-item:first-child a').attr('href');
			//$('#show').html("<img src='"+img+"' />");
			
			$('.field-name-field-prod-image .field-item a').mouseover(function(){
				//e.preventDefault();
				var href = $(this).attr('href');
				$('#show img').attr("src",href);
				
				/*$('#show img').addpowerzoom({
					magnifiersize: [150, 150]
				});*/
			});
			$('.field-name-field-prod-image .field-item a').click(function(){
				var href = $(this).attr('href');
				$('#show img').attr("src",href);
				return false;
			});
		}
	});
	$(window).load(function(){
		$('.node-shoe .field-name-body .field-item, .node-clothing .field-name-body .field-item, .node-accessory .field-name-body .field-item').jScrollPane({scrollbarWidth: 5, scrollbarMargin: 20});
	});
})(jQuery);

function init_map() {
    var latlng = new google.maps.LatLng(18.016584331627012, -76.79707825183868);
    var myOptions = {
        zoom: 16,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), myOptions);

    var contentString = '<div id="address">'
							+ '<strong>Western Sports Ltd.</strong><br/>'
							+ 'Twin Gates Plaza<br/>'
							+ 'Kingston 10, Jamaica<br/>'
							+ '<strong>Telephone: </strong>929 - 8000'+ '</div>';

    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        animation: google.maps.Animation.DROP,
        title: "Western Sports Ltd."
    });

    function address() {
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        infowindow.open(map, marker);

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });
    }
    setTimeout(address, 800);
}