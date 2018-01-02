erpApp.service('utils',function myutils($mdDialog, $rootScope,$mdToast,$location, $anchorScroll) {
		var me = this;
		this.progressBarDialog = null;
		this.progressBarCount = 0;
		
		function hideProgressBar() {
			me.progressBarCount--;
			if(me.progressBarCount === 0)
				$rootScope.$emit("hide-progress-bar");
		};

		function showProgressBar(id) {
			me.progressBarCount++;
			$rootScope.$emit("show-progress-bar");
		};
		
		function showToast(message) {
			$mdToast.show({
				hideDelay : 3000,
				position : 'top right',
				controller : 'ToastCtrl',
				templateUrl : 'views/toast.html',
				locals : {
					message : message
				}
			});
		};
		
		function getCurrentDate(){
			var currentDate = new Date();
			var curr_year = currentDate.getFullYear();
			var curr_date = currentDate.getDate() < 10 ? "0"
					+ currentDate.getDate()
					: currentDate.getDate();
			var curr_month = (currentDate.getMonth() + 1) < 10 ? ("0" + (currentDate
					.getMonth() + 1))
					: (currentDate.getMonth() + 1);
			var currentDateFormatted = curr_year + "-"
					+ curr_month + "-" + curr_date;
			return currentDateFormatted;
		}
		
		function getCurrentMonthYearString(){
			var currentDate = new Date();
			var curr_year = currentDate.getFullYear();
			var curr_date = currentDate.getDate() < 10 ? "0"
					+ currentDate.getDate()
					: currentDate.getDate();
			var curr_month = (currentDate.getMonth() + 1) < 10 ? ("0" + (currentDate
					.getMonth() + 1))
					: (currentDate.getMonth() + 1);
			var currentDateFormatted = curr_month + "-" + curr_year;
			return currentDateFormatted;
		}
		
		function scrollToTop(){
			$anchorScroll.yOffset = 50;
			$anchorScroll();
		}
		
		
		function showConfirm(ev){
			var confirm = $mdDialog.confirm().title('You want to back home page else same page')
			.ariaLabel('').targetEvent(ev).ok('YES' ).cancel('NO');

	$mdDialog.show(confirm)
			.then(function() {
				$location.path('/');
			}, function() {});
		};
		

		return {
			hideProgressBar : hideProgressBar,
			showProgressBar : showProgressBar,
			showToast : showToast,
			getCurrentDate : getCurrentDate,
			getCurrentMonthYearString : getCurrentMonthYearString,
			scrollToTop : scrollToTop,
			showConfirm : showConfirm
		};
});