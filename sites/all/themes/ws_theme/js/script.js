(function($){
	$(document).ready(function(){
		if($('#map').length > 0){
			init_map();
		}
		
		if($('#show').length > 0){
			$('#show').attr('title','Click and Drag to position item').append("<div id='zoom'><a id='in' title='zoom in'>+</a><a id='out' title='reset'>R</a></div>");
			$('#zoom a').click(function(){
				var img = $(this).parents('#show').find('img');
				if($(this).attr('id') == 'in'){
					img.css({
						"max-width" : 1000,
						"max-height" : 1000,
						"width":img.width()*1.5
					});
				}else{
					img.css({
						"width" : "auto",
						"max-width" : "95%",
						"max-height" : "95%",
						'top': 0,
						'left': 0
					});
				}
				return false;
			});
			
			$('#show img').dblclick(function() {
				$(this).css({
					"max-width" : 1000,
					"max-height" : 1000,
					"width": $(this).width()*1.5
				});
			});

			$('.field-name-field-prod-image .field-item a').click(function(){
				//$('#show img').draggable();
				var href = $(this).attr('href');
				$('#show img').attr("src",href);
				$('#show img').css({
					"width" : "auto",
					"max-width" : "90%",
					"max-height" : "90%",
					'top': 0,
					'left': 0
				});
				return false;
			});
		}
	});
	$(window).load(function(){
		if($('#block-views-banners-block-1').length > 0 || $('#block-views-slider-block-2').length > 0){
		$('#block-views-banners-block-1 .view-content, #block-views-slider-block-2 .view-content').cycle({
            fx: 'fade',
			speed: 1000,
			pause: true, 
    		pauseOnPagerHover: true,
            delay: 2000,
            pager: '#block-views-banners-block-2 .view-content',
            pagerAnchorBuilder: function (idx, slide) {
                return '#block-views-banners-block-2 .view-content .views-row:eq(' + idx + ')';
            }
        });
		}
		$('.product-class .field-name-body .field-item').jScrollPane({scrollbarWidth: 5, scrollbarMargin: 20});
		if($('#show').length > 0){
			$('#show img').draggable();
		}
	});
})(jQuery);



function init_map() {
    var latlng = new google.maps.LatLng(18.18238775108558, -77.33001708984375);
    var myOptions = {
        zoom: 8,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), myOptions);
	
	var locations = [
      ['Twin Gates Plaza', 18.016584331627012, -76.79707825183868, 'Kingston 10, Jamaica','929 - 8000'],
      ['Spanish Town', 17.993529666397066, -76.95270538330078, 'St. Catherine, Jamaica','929 - 8000'],
      ['Montego Bay', 18.49436306969241, -77.90441751480103, 'St. James, Jamaica','929 - 8000']
    ];
	
	var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map,
		animation: google.maps.Animation.DROP,
        title: "Western Sports Ltd."
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent('<strong>Western Sports Ltd.</strong><br/>'
		  						+ locations[i][0] + '<br/>'
								+ locations[i][3] + '<br/>'
								+ '<strong>Telephone: </strong>'+locations[i][4]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
}