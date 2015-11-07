var app = angular.module('app',[]);

app.controller('listarCtrl', function($scope,$http){
  var refresh = function(){
    console.log('estou vivo!');
    // $http.post('/sgc/chamados/listarTecnico').success(function(res){
    //   $scope.chamadoslist = res;
    //   $scope.chamados = "";
    // });
  };
  refresh();
});
