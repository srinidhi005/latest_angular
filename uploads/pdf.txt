var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
			   });
			   try {
				var companyName = window.location.href.split("=")[1];
			   } catch (error) {
				   console.log(error);
			   }

$("#actualsId").attr("href","/actual?CompanyName="+companyName);
	$("#financialId").attr("href","/FinancialModel?CompanyName="+companyName+'&senario=1');
	$("#pdfId").attr("href","/pdf?CompanyName="+companyName);

var actualObj = new Map();
var rojectionObj = new Map();
	var actualXAxis = [];
		var yearsArray = [];
	var previousAmount = 0;
	var totalRevenue=[];
function loadActuals(){
let actualsInput = {
	"async": true,
	"crossDomain": true,
	"url": "http://34.67.197.111:8000/actuals?company="+companyName,
	"method": "GET",
	"headers": {
		"authorization": "Basic cm1pX3VzZXI6cm1pMzIxIUAj",
		"content-type": "application/json",
		"cache-control": "no-cache",
		"postman-token": "648dcbfa-30ef-3359-f29a-31b2038f29ac"
	},
	"processData": false,
}
	

	$.ajax(actualsInput).done(function (response){
			let resObject = JSON.parse(response);
			for (let j=0; j<resObject.length; j++) {
	
				if( resObject[j].latest === 0){
					previousAmount = resObject[j].totalrevenue;
				}
				actualObj.set(resObject[j].asof,{
		
					"totalRevenue":resObject[j].totalrevenue,
					"p_GrossProfit" : resObject[j].grossprofit, 
					"p_EBIT" : resObject[j].ebit, 
					"p_EBITDA" : resObject[j].ebitda, 
					"p_EBT" : resObject[j].ebt,
					"p_NetInCome" : resObject[j].netincome,
					"latest" : resObject[j].latest,
					"p_COGS" : resObject[j].cogs,
					"p_SGAndA" : resObject[j].sga,
					"p_Ebitmargin" : resObject[j].ebitmargin,
					"p_Ebitdamargin" : resObject[j].ebitdamargin,
					"p_DAndA" : resObject[j].da,
					"p_GrossProfitMargin" : resObject[j].grossprofitmargin,
					"p_taxes" : resObject[j].taxes,
					"p_NetInCome" : resObject[j].netincome,
					"p_NetIM" : resObject[j].netincomemargin,
					"p_NIE" : resObject[j].netinterest,
					"p_OIOrE" : resObject[j].otherincome,
					"p_EBTmargin":resObject[j].ebtmargin

					}
				);
			yearsArray.push(resObject[j].asof);
			}
				 console.log(actualObj);
	});
}

function updateProjectionPdf(){

let scenario = $("#sel2").val();
yearsArray=[]
actualObj.clear();
loadData(scenario);
}
	function loadData(scenario){
	//actualObj.clear();
	loadActuals();
	let assumptionInput = {
	"async": true,
	"crossDomain": true,
	"url": "http://34.67.197.111:8000/projections?company="+companyName+"&scenario="+scenario,
	"method": "GET",
	"headers": {
		"authorization": "Basic cm1pX3VzZXI6cm1pMzIxIUAj",
		"content-type": "application/json",
		"cache-control": "no-cache",
		"postman-token": "648dcbfa-30ef-3359-f29a-31b2038f29ac"
	},
	"processData": true,


}

    
	$.ajax(assumptionInput).done(function (response){
					resObject = JSON.parse(response);
					let totalRevenue = 0;
					let revenueGrowthArray = [];
					let COGSArray = [];
					let SGAndAArray = [];
					let DAndAArray = [];
					let otherIncomeOrExpenseArray = [];
					let netinterestdollarsArray = [];
					//actualObj.clear();
					//yearsArray = [];
					for (let j=0; j<resObject.length; j++) {
						if(j == 0){
							totalRevenue = Math.round(previousAmount + (previousAmount * (resObject[j].revenuepercent/100)));
						}else{
							totalRevenue = Math.round(resObject[j-1].totalRevenue + (resObject[j-1].totalRevenue * (resObject[j].revenuepercent/100)));
						}
						actualObj.set(resObject[j].asof,{
									"totalRevenue": totalRevenue,
									"revenueGrowth" : resObject[j].revenuepercent, 
									"COGS" : resObject[j].cogspercent, 
									"SGAndA" : resObject[j].sgapercent, 
									"DAndA" : resObject[j].dapercent,
									"netIterestExpense" : resObject[j].netinterestdollars,
									"otherIncomeOrExpense" :resObject[j].otherincomepercent,
									"taxes" : resObject[j].taxespercent,
									"latest" : resObject[j].latest,
									"p_GrossProfitMargin":resObject[j].grossprofitmargin,
	   								"p_Ebitmargin":resObject[j].ebitmargin,
	    								"p_Ebitdamargin":resObject[j].ebitdamargin,
	    								"p_NetIM":resObject[j].netincomemargin,
									"p_EBTmargin":resObject[j].ebtmargin,
									"p_OIOrE" : resObject[j].otherincome,
								}       
						);
					yearsArray.push(resObject[j].asof);
					}
					updateProjection(actualObj);
					appendTotable();
					console.log("Actual OBJ:",actualObj);
					
	
	});
	
	}
	function visuals(){
		var companyName = decodeURI(window.location.href).split("=")[1];
	 	window.location.href = "/#/FinancialModel?companyname="+companyName+"&scenario=1";
 	}
function updateProjection(obj){
	console.log(obj);
	let totalRevenueArray = [];
	let p_GrossProfitArray = [];
	let p_EBITArray = [];
	let p_EBITDAArray = [];
	let p_EBTArray = [];
	let p_NetInComeArray =[];
	//let revenueGrowthArray =[];
	let lastKey = 0;
	for (let [key, value] of obj) {
		if(typeof obj.get(key).COGS !== 'undefined'){
			obj.get(key).totalRevenue = Math.round(obj.get(lastKey).totalRevenue + (obj.get(lastKey).totalRevenue * (obj.get(key).revenueGrowth/100)));
			obj.get(key).p_COGS = Math.round(obj.get(key).totalRevenue * (obj.get(key).COGS/100));
			obj.get(key).p_GrossProfit = Math.round(obj.get(key).totalRevenue - obj.get(key).p_COGS);
			obj.get(key).p_SGAndA = Math.round(obj.get(key).totalRevenue * (obj.get(key).SGAndA/100));
			obj.get(key).p_EBIT = Math.round(obj.get(key).p_GrossProfit - obj.get(key).p_SGAndA);
			obj.get(key).p_DAndA = Math.round(obj.get(key).totalRevenue * (obj.get(key).DAndA/100));
			obj.get(key).p_EBITDA = Math.round(obj.get(key).p_EBIT + obj.get(key).p_DAndA);
			obj.get(key).p_NIE = obj.get(key).netIterestExpense;
			obj.get(key).p_OIOrE = Math.round(obj.get(key).totalRevenue * (obj.get(key).otherIncomeOrExpense/100));
			obj.get(key).p_EBT = Math.round(obj.get(key).p_EBIT - obj.get(key).p_NIE - obj.get(key).p_OIOrE);
			obj.get(key).p_taxes = Math.round(obj.get(key).p_EBT * (obj.get(key).taxes/100));
			obj.get(key).p_NetInCome = obj.get(key).p_EBT - obj.get(key).p_taxes;
			obj.get(key).p_GrossProfitMargin = obj.get(key).p_GrossProfitMargin;
			obj.get(key).p_Ebitmargin = obj.get(key).p_Ebitmargin;
			obj.get(key).p_Ebitdamargin = obj.get(key).p_Ebitdamargin;
			obj.get(key).p_NetIM = obj.get(key).p_NetIM;
			//revenueGrowthArray.push(obj.get(key).revenueGrowth);
			}
	lastKey = key;
	}
	}
	
function appendTotable(){
	$("#myTable").find("tr:gt(0)").remove();	
	console.log("yearsarray",yearsArray);
	var str ='<td style="width:400px">&nbsp</td>';
	for (let i=0;i<yearsArray.length;i++) {
		str = str +  '<td style="font-weight:bold;text-align:center;font-size:12px;width:85px">'+yearsArray[i]+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	
		       str='<td style="font-weight:bold;text-align:left;padding-left:5px;font-size:12px">Total Revenue</td>';
	
	for (let i=0;i<yearsArray.length;i++) {
		str = str +  '<td style="text-align:right;padding-right:5px;font-weight:bold;font-size:12px">'+formatter.format(actualObj.get(yearsArray[i]).totalRevenue)+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	
	str='<td style="text-align:left;padding-left:5px;font-size:12px">(-) Cost of Goods Sold (COGS)</td>';
	
	for (let i=0;i<yearsArray.length;i++) {
	  str = str +  '<td style="text-align:right; padding-right:5px;font-size:12px">'+formatter.format(actualObj.get(yearsArray[i]).p_COGS)+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	
	str='<td style="font-weight:bold;text-align:left;padding-left:5px;font-size:12px">Gross Profit</td>';
	
	for (let i=0;i<yearsArray.length;i++) {
		str = str +  '<td style="padding-right:5px; text-align:right ;font-weight:bold;font-size:12px">'+formatter.format(actualObj.get(yearsArray[i]).p_GrossProfit)+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	
	str='<td style="font-style: italic;text-align:left;padding-left:5px;font-size:12px">Gross Profit Margin</td>';
	
	for (let i=0;i<yearsArray.length;i++) {
		str = str +  '<td style="font-style: italic;text-align:right;padding-right:5px;font-size:12px">'+actualObj.get(yearsArray[i]).p_GrossProfitMargin+'%'+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	
	
	str='<td style="text-align:left;padding-left:5px;font-size:12px">(-) Selling, General & Administrative Expense (SG&A)</td>';
	
	for (let i=0;i<yearsArray.length;i++) {
	  str = str +  '<td style=" text-align:right;padding-right:5px;font-size:12px">'+formatter.format(actualObj.get(yearsArray[i]).p_SGAndA)+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	
	str='<td style="font-weight:bold;text-align:left;padding-left:5px;font-size:12px">EBIT</td>';
	
	for (let i=0;i<yearsArray.length;i++) {
		str = str +  '<td style="text-align:right; padding-right:5px;font-weight:bold;font-size:12px">'+formatter.format(actualObj.get(yearsArray[i]).p_EBIT)+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	
	
	
	str='<td style="font-style: italic;text-align:left;padding-left:5px;font-size:12px">EBIT Margin</td>';
	
	for (let i=0;i<yearsArray.length;i++) {
		str = str +  '<td style="font-style: italic;text-align:right ;padding-right:5px;font-size:12px">'+actualObj.get(yearsArray[i]).p_Ebitmargin+'%'+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	
	
	str='<td style="text-align:left;padding-left:5px;font-size:12px">(+) Depreciation & Amortization (D&A)</td>';
	
	for (let i=0;i<yearsArray.length;i++) {
	  str = str +  '<td style="text-align:right; padding-right:5px;font-size:12px">'+formatter.format(actualObj.get(yearsArray[i]).p_DAndA)+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	
	
	
	str='<td style="font-weight:bold;text-align:left;padding-left:5px;font-size:12px">EBITDA</td>';
	
	
	
	for (let i=0;i<yearsArray.length;i++) {
		str = str +  '<td style="text-align:right; padding-right:5px;font-weight:bold;font-size:12px">'+formatter.format(actualObj.get(yearsArray[i]).p_EBITDA)+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	
	str='<td style="font-style: italic;text-align:left;padding-left:5px;font-size:12px">EBITDA Margin</td>';
	
	
	
	for (let i=0;i<yearsArray.length;i++) {
		str = str +  '<td style="text-align:right; font-style:italic;padding-right:5px;font-size:12px">'+actualObj.get(yearsArray[i]).p_Ebitdamargin+'%'+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	
	
	  str='<td style="text-align:left;padding-left:5px;font-size:12px">EBIT</td>';
	
	for (let i=0;i<yearsArray.length;i++) {
	    str = str +  '<td style="text-align:right; padding-right:5px;font-size:12px">'+formatter.format(actualObj.get(yearsArray[i]).p_EBIT)+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	
	
	str='<td style="text-align:left;padding-left:5px;font-size:12px">(-) Net Interest Expense</td>';
	
	for (let i=0;i<yearsArray.length;i++) {
	  str = str +  '<td style="text-align:right; padding-right:5px;font-size:12px">'+formatter.format(actualObj.get(yearsArray[i]).p_NIE)+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	
		    str='<td style="text-align:left;padding-left:5px;font-size:12px">(+/-) Other Income/Expense</td>';
	       	
	       	for (let i=0;i<yearsArray.length;i++) {
	       str = str +  '<td style="text-align:right; padding-right:5px;font-size:12px">'+formatter.format(actualObj.get(yearsArray[i]).p_OIOrE)+'</td>';	
			    	}
			    	$('#myTable tr:last').after('<tr>'+str+'</tr>');
			    	

	
		str='<td style="font-weight:bold;text-align:left;padding-left:5px;font-size:12px">EBT</td>';
	
	for (let i=0;i<yearsArray.length;i++) {
		str = str +  '<td style="text-align:right;padding-right:5px;font-weight:bold;font-size:12px">'+formatter.format(actualObj.get(yearsArray[i]).p_EBT)+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	

		    str='<td style="font-style:italic;text-align:left;padding-left:5px;font-size:12px">EBT Margin</td>';
	       	
	       	for (let i=0;i<yearsArray.length;i++) {
	       		str = str +  '<td style="text-align:right; font-style:italic;padding-right:5px;font-size:12px">'+actualObj.get(yearsArray[i]).p_EBTmargin+'%'+'</td>';	
			    	}
			    	$('#myTable tr:last').after('<tr>'+str+'</tr>');
			    	
	
	   str='<td style="text-align:left;padding-left:5px;font-size:12px">(-) Taxes</td>';
	
	for (let i=0;i<yearsArray.length;i++) {
	     str = str +  '<td style="text-align:right; padding-right:5px;font-size:12px">'+formatter.format(actualObj.get(yearsArray[i]).p_taxes)+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	
	
		str='<td style="font-weight:bold;text-align:left;padding-left:5px;font-size:12px">Net Income</td>';
	
	for (let i=0;i<yearsArray.length;i++) {
		str = str +  '<td style="text-align:right; padding-right:5px;font-weight:bold;font-size:12px">'+formatter.format(actualObj.get(yearsArray[i]).p_NetInCome)+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');
	
	
	
		str='<td style="font-style: italic;text-align:left;padding-left:5px;font-size:12px">Net Income Margin</td>';
	
	for (let i=0;i<yearsArray.length;i++) {
		str = str +  '<td style="text-align:right; font-style: italic;padding-right:5px;font-size:12px">'+actualObj.get(yearsArray[i]).p_NetIM+'%'+'</td>';	
	}
	$('#myTable tr:last').after('<tr>'+str+'</tr>');

	}

	$("#sel2").val("1");
	updateProjectionPdf();

