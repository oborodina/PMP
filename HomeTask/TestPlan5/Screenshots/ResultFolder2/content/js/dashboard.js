/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.58682983682984, "KoPercent": 1.4131701631701632};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9763192243147492, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Open Home Page-16"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-17"], "isController": false}, {"data": [0.46875, 500, 1500, "Open Home Page"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-18"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-19"], "isController": false}, {"data": [0.9973614775725593, 500, 1500, "SelectMonth"], "isController": true}, {"data": [0.871031746031746, 500, 1500, "UpdatePost"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-10"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-11"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-12"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-13"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-14"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-15"], "isController": false}, {"data": [1.0, 500, 1500, "ClickLoginIn "], "isController": false}, {"data": [0.0, 500, 1500, "8.Editor"], "isController": true}, {"data": [1.0, 500, 1500, "ClickLogin"], "isController": true}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-3"], "isController": false}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-4"], "isController": false}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-5"], "isController": false}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-6"], "isController": false}, {"data": [0.9375, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-0"], "isController": false}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-1"], "isController": false}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-2"], "isController": false}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-7"], "isController": false}, {"data": [0.8683862433862434, 500, 1500, "Updated"], "isController": true}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-8"], "isController": false}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-9"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-20"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-21"], "isController": false}, {"data": [1.0, 500, 1500, "Login"], "isController": false}, {"data": [0.9993403693931399, 500, 1500, "ClickCalendarMonthJune"], "isController": false}, {"data": [1.0, 500, 1500, "OpenPost_1/post/test122-107"], "isController": false}, {"data": [1.0, 500, 1500, "SelectPredefinedDate"], "isController": true}, {"data": [0.998015873015873, 500, 1500, "1/api/customfields-123"], "isController": false}, {"data": [1.0, 500, 1500, "SelectDate_1/2021/05/25/default-106"], "isController": false}, {"data": [1.0, 500, 1500, "1/api/customfields-122"], "isController": false}, {"data": [0.9993386243386243, 500, 1500, "1/api/customfields-126"], "isController": false}, {"data": [1.0, 500, 1500, "OpenPost_1/post/test122-107-1"], "isController": false}, {"data": [1.0, 500, 1500, "OpenPost_1/post/test122-107-0"], "isController": false}, {"data": [1.0, 500, 1500, "ClickLoginIn -5"], "isController": false}, {"data": [1.0, 500, 1500, "ClickLoginIn -3"], "isController": false}, {"data": [1.0, 500, 1500, "ClickLoginIn -4"], "isController": false}, {"data": [0.9980211081794196, 500, 1500, "ClickCalendarMonthMay"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-5"], "isController": false}, {"data": [0.9933862433862434, 500, 1500, "ClickEdit"], "isController": true}, {"data": [1.0, 500, 1500, "Open Home Page-6"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-3"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-4"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-9"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-7"], "isController": false}, {"data": [1.0, 500, 1500, "OpenRandomPost"], "isController": true}, {"data": [1.0, 500, 1500, "Open Home Page-8"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-1"], "isController": false}, {"data": [1.0, 500, 1500, "SelectDate_1/2021/05/25/default-106-1"], "isController": false}, {"data": [0.53125, 500, 1500, "Open Home Page-2"], "isController": false}, {"data": [0.90625, 500, 1500, "Open Home Page-0"], "isController": false}, {"data": [1.0, 500, 1500, "SelectDate_1/2021/05/25/default-106-0"], "isController": false}, {"data": [0.998015873015873, 500, 1500, "1/api/posts/9ed63028-d56a-471e-aa34-0f6540c99f7c-125"], "isController": false}, {"data": [1.0, 500, 1500, "ClickLoginIn -1"], "isController": false}, {"data": [1.0, 500, 1500, "ClickLoginIn -2"], "isController": false}, {"data": [1.0, 500, 1500, "ClickLoginIn -0"], "isController": false}, {"data": [0.998015873015873, 500, 1500, "1/api/posts/9ed63028-d56a-471e-aa34-0f6540c99f7c-121"], "isController": false}, {"data": [0.875, 500, 1500, "12/admin/app/editor/editpost.cshtml-181"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6864, 97, 1.4131701631701632, 23.44944638694642, 1, 2595, 9.5, 32.0, 48.0, 328.9000000000051, 3.4335691410974816, 25.07179130472001, 5.583500878651543], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Open Home Page-16", 16, 0, 0.0, 13.125, 4, 27, 11.0, 26.3, 27.0, 27.0, 0.008648980582498031, 0.01809191055440506, 0.003386954310138389], "isController": false}, {"data": ["Open Home Page-17", 16, 0, 0.0, 9.812499999999998, 5, 24, 9.0, 19.800000000000004, 24.0, 24.0, 0.008648994608432986, 0.19715315639652614, 0.003978199668527282], "isController": false}, {"data": ["Open Home Page", 32, 0, 0.0, 883.25, 419, 2595, 762.5, 1714.0, 2595.0, 2595.0, 0.017271781740812085, 3.908299337384286, 0.1487667138222291], "isController": false}, {"data": ["Open Home Page-18", 16, 0, 0.0, 10.624999999999998, 3, 22, 8.5, 19.200000000000003, 22.0, 22.0, 0.00864904603725036, 0.007094920577431936, 0.0033278556041764083], "isController": false}, {"data": ["Open Home Page-19", 16, 0, 0.0, 216.4375, 57, 324, 247.5, 321.9, 324.0, 324.0, 0.008648022251361253, 0.012456867989021335, 0.003530149708075199], "isController": false}, {"data": ["SelectMonth", 758, 0, 0.0, 42.882585751978816, 21, 1005, 32.0, 62.0, 73.14999999999986, 223.9699999999931, 0.3799807302648135, 4.18869383127853, 2.1121585123704283], "isController": true}, {"data": ["UpdatePost", 756, 97, 12.83068783068783, 30.201058201058224, 5, 1008, 26.0, 43.0, 54.0, 67.7199999999998, 0.38043401683974065, 0.07252603327967336, 0.6693469348139396], "isController": false}, {"data": ["Open Home Page-10", 16, 0, 0.0, 15.562500000000002, 8, 46, 12.5, 29.200000000000017, 46.0, 46.0, 0.00864882162508115, 0.06357812967070152, 0.0033531076026925943], "isController": false}, {"data": ["Open Home Page-11", 16, 0, 0.0, 15.5625, 3, 31, 14.5, 28.900000000000002, 31.0, 31.0, 0.008648882402227087, 0.019599347279656208, 0.0032855617719397823], "isController": false}, {"data": ["Open Home Page-12", 16, 0, 0.0, 16.8125, 6, 57, 11.5, 36.00000000000002, 57.0, 57.0, 0.00864888707742754, 0.1303287617658649, 0.0032179941176756766], "isController": false}, {"data": ["Login-0", 16, 0, 0.0, 13.5, 3, 37, 8.5, 34.900000000000006, 37.0, 37.0, 0.008650570478089998, 0.009833265660641364, 0.009290493050077613], "isController": false}, {"data": ["Open Home Page-13", 16, 0, 0.0, 14.6875, 6, 29, 13.0, 27.6, 29.0, 29.0, 0.00864891045350562, 0.15350865857290816, 0.0034207116539743906], "isController": false}, {"data": ["Open Home Page-14", 16, 0, 0.0, 12.875, 4, 26, 11.0, 23.200000000000003, 26.0, 26.0, 0.00864894318022722, 0.2450759133959697, 0.00341227836407402], "isController": false}, {"data": ["Logout-0", 14, 0, 0.0, 5.071428571428572, 3, 10, 4.5, 8.5, 10.0, 10.0, 0.008847650411636935, 0.004155976414059928, 0.010757153088367173], "isController": false}, {"data": ["Open Home Page-15", 16, 0, 0.0, 13.375, 4, 28, 10.0, 28.0, 28.0, 28.0, 0.008648957206040865, 0.02306670129853281, 0.0034629613813249556], "isController": false}, {"data": ["ClickLoginIn ", 16, 0, 0.0, 289.1875, 262, 402, 269.0, 381.70000000000005, 402.0, 402.0, 0.00864871877339546, 0.6507274045465233, 0.019839687889361267], "isController": false}, {"data": ["8.Editor", 14, 8, 57.142857142857146, 6944.714285714286, 4676, 11616, 5811.0, 10998.5, 11616.0, 11616.0, 0.008791092864709476, 14.847729662002887, 6.1282465525572345], "isController": true}, {"data": ["ClickLogin", 16, 0, 0.0, 289.1875, 262, 402, 269.0, 381.70000000000005, 402.0, 402.0, 0.00864871409837696, 0.6507270527993184, 0.01983967716512449], "isController": true}, {"data": ["12/admin/app/editor/editpost.cshtml-181-3", 16, 0, 0.0, 36.625, 8, 78, 33.5, 76.6, 78.0, 78.0, 0.008657544860962535, 0.6706764964972115, 0.01016246965124704], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-4", 16, 0, 0.0, 17.9375, 5, 40, 14.0, 39.3, 40.0, 40.0, 0.008657661976739027, 0.2674152252561315, 0.010061150148749455], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-5", 16, 0, 0.0, 27.9375, 8, 77, 27.0, 50.40000000000003, 77.0, 77.0, 0.008657591706892903, 0.05288401965489757, 0.010077977846305021], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-6", 16, 0, 0.0, 40.3125, 6, 125, 33.5, 113.10000000000001, 125.0, 125.0, 0.008657577653060562, 0.04007511530811236, 0.010162508143533979], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-0", 16, 0, 0.0, 190.625, 4, 1405, 14.0, 1395.2, 1405.0, 1405.0, 0.008651206600005514, 0.19202468243313023, 0.010408482940631635], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-1", 16, 0, 0.0, 134.93749999999997, 131, 142, 134.5, 138.5, 142.0, 142.0, 0.008657099849907531, 0.009663149539496395, 0.0035592178093858113], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-2", 16, 0, 0.0, 48.875, 13, 147, 40.0, 107.10000000000004, 147.0, 147.0, 0.008657516753647655, 1.3076063048365758, 0.010339983388389729], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-7", 16, 0, 0.0, 45.06249999999999, 23, 128, 43.0, 78.30000000000005, 128.0, 128.0, 0.008657652607360303, 3.163272911936522, 0.010331690904486612], "isController": false}, {"data": ["Updated", 756, 97, 12.83068783068783, 47.46031746031745, 11, 1017, 35.0, 65.0, 80.0, 282.48999999999785, 0.38043286819208844, 0.4078774190636621, 1.6189410184379105], "isController": true}, {"data": ["12/admin/app/editor/editpost.cshtml-181-8", 16, 0, 0.0, 45.5, 12, 111, 34.5, 102.60000000000001, 111.0, 111.0, 0.008657708823936834, 1.8438087439071373, 0.010111933352957472], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-9", 16, 0, 0.0, 29.375, 11, 89, 22.5, 70.80000000000001, 89.0, 89.0, 0.008657676030845135, 0.012758235479048153, 0.010069621242906793], "isController": false}, {"data": ["Open Home Page-20", 16, 0, 0.0, 181.93749999999997, 57, 286, 218.5, 261.5, 286.0, 286.0, 0.008649415407636137, 0.017265044036336195, 0.00353071839882022], "isController": false}, {"data": ["Open Home Page-21", 16, 0, 0.0, 180.99999999999997, 57, 285, 219.0, 259.8, 285.0, 285.0, 0.008649415407636137, 0.014883076121342648, 0.00353071839882022], "isController": false}, {"data": ["Login", 32, 0, 0.0, 13.5, 3, 37, 8.5, 34.0, 37.0, 37.0, 0.017298325846401678, 0.019663331333214407, 0.01857796274373071], "isController": false}, {"data": ["ClickCalendarMonthJune", 758, 0, 0.0, 20.741424802110817, 9, 609, 15.0, 35.0, 43.0, 60.91999999999962, 0.37998320654694023, 1.8895258669306831, 0.947360474916346], "isController": false}, {"data": ["OpenPost_1/post/test122-107", 16, 0, 0.0, 59.9375, 31, 135, 54.0, 132.9, 135.0, 135.0, 0.008650603217375602, 0.2959257103429315, 0.0200013519946669], "isController": false}, {"data": ["SelectPredefinedDate", 758, 0, 0.0, 1.1042216358839057, 0, 68, 0.0, 0.0, 0.0, 54.819999999999936, 0.3799942549681241, 0.33685011833462253, 0.01819604745817431], "isController": true}, {"data": ["1/api/customfields-123", 756, 0, 0.0, 11.394179894179905, 3, 711, 4.0, 14.300000000000068, 21.0, 148.50999999999215, 0.3804215735262816, 0.08581775730915141, 0.48890116285213525], "isController": false}, {"data": ["SelectDate_1/2021/05/25/default-106", 16, 0, 0.0, 52.1875, 33, 68, 53.5, 63.10000000000001, 68.0, 68.0, 0.00865059854031963, 0.36329134729287627, 0.01962435586832275], "isController": false}, {"data": ["1/api/customfields-122", 756, 0, 0.0, 7.343915343915336, 2, 432, 4.0, 13.0, 19.0, 35.28999999999985, 0.38043669704457045, 0.0858211689622029, 0.46551482558285817], "isController": false}, {"data": ["1/api/customfields-126", 756, 0, 0.0, 6.022486772486773, 1, 578, 3.0, 9.0, 15.149999999999977, 87.18999999999835, 0.3804443549807513, 0.06761803965478197, 0.48744432981908764], "isController": false}, {"data": ["OpenPost_1/post/test122-107-1", 16, 0, 0.0, 8.5625, 3, 27, 6.0, 22.800000000000004, 27.0, 27.0, 0.008651173856152605, 0.02394279951985985, 0.01009585230283434], "isController": false}, {"data": ["OpenPost_1/post/test122-107-0", 16, 0, 0.0, 46.875, 24, 107, 46.0, 104.2, 107.0, 107.0, 0.008650626602731328, 0.27198522537180125, 0.00990619240237092], "isController": false}, {"data": ["ClickLoginIn -5", 16, 0, 0.0, 13.124999999999998, 6, 26, 11.5, 24.6, 26.0, 26.0, 0.008650364693969018, 0.063247344202877, 0.003345258221495832], "isController": false}, {"data": ["ClickLoginIn -3", 16, 0, 0.0, 14.750000000000002, 6, 32, 12.0, 32.0, 32.0, 32.0, 0.008650336633256544, 0.4843174803299455, 0.0033367997755237647], "isController": false}, {"data": ["ClickLoginIn -4", 16, 0, 0.0, 13.875000000000002, 3, 32, 12.5, 27.100000000000005, 32.0, 32.0, 0.008650364693969018, 0.021828654657437448, 0.0032607820037812906], "isController": false}, {"data": ["ClickCalendarMonthMay", 758, 0, 0.0, 22.141160949868066, 9, 980, 16.0, 31.0, 42.0, 57.0, 0.3799913975562242, 2.2992448234944973, 1.1648369110634647], "isController": false}, {"data": ["Logout", 28, 0, 0.0, 5.071428571428571, 3, 10, 4.5, 7.300000000000004, 10.0, 10.0, 0.017691946562739116, 0.008310377242849136, 0.021510227998642772], "isController": false}, {"data": ["Open Home Page-5", 16, 0, 0.0, 16.375, 7, 32, 15.0, 27.800000000000004, 32.0, 32.0, 0.00864855982560179, 0.03287972988385525, 0.0034121271186944566], "isController": false}, {"data": ["ClickEdit", 756, 0, 0.0, 36.117724867724846, 7, 2071, 13.0, 41.0, 59.299999999999955, 604.8999999999985, 0.3800106362765392, 7.462223837260446, 1.5035431373647972], "isController": true}, {"data": ["Open Home Page-6", 16, 0, 0.0, 20.249999999999996, 9, 72, 15.5, 41.900000000000034, 72.0, 72.0, 0.00864856917531028, 0.024391667752242278, 0.003479697754128746], "isController": false}, {"data": ["Open Home Page-3", 16, 0, 0.0, 17.687499999999996, 9, 39, 15.0, 32.7, 39.0, 39.0, 0.008648564500453508, 0.13357978138591084, 0.0033614537804497035], "isController": false}, {"data": ["Open Home Page-4", 16, 0, 0.0, 17.3125, 7, 38, 13.5, 34.5, 38.0, 38.0, 0.00864856917531028, 0.03318381668925204, 0.0033361179924292586], "isController": false}, {"data": ["Open Home Page-9", 16, 0, 0.0, 12.6875, 4, 44, 9.0, 27.900000000000016, 44.0, 44.0, 0.008648784224185135, 0.021393916445176707, 0.003319308789164803], "isController": false}, {"data": ["Open Home Page-7", 16, 0, 0.0, 12.125, 4, 22, 12.5, 21.3, 22.0, 22.0, 0.0086486720234379, 0.011908815969772892, 0.0031334544147416615], "isController": false}, {"data": ["OpenRandomPost", 758, 0, 0.0, 1.2651715039577858, 0, 135, 0.0, 0.0, 0.0, 56.0, 0.3800049230189235, 0.27439507135996144, 0.018546115514979363], "isController": true}, {"data": ["Open Home Page-8", 16, 0, 0.0, 13.812499999999996, 8, 26, 13.0, 21.800000000000004, 26.0, 26.0, 0.008648704748355125, 0.5328032871024028, 0.003344616289402958], "isController": false}, {"data": ["Open Home Page-1", 16, 0, 0.0, 12.874999999999998, 5, 36, 11.0, 23.400000000000013, 36.0, 36.0, 0.00864855982560179, 0.03009681927591014, 0.0032432099346006715], "isController": false}, {"data": ["SelectDate_1/2021/05/25/default-106-1", 16, 0, 0.0, 5.625, 3, 10, 5.0, 10.0, 10.0, 10.0, 0.008650804335566864, 0.08055216732385746, 0.009825083439711193], "isController": false}, {"data": ["Open Home Page-2", 16, 0, 0.0, 702.1875, 401, 944, 723.0, 943.3, 944.0, 944.0, 0.008645410124747864, 0.013559110019868233, 0.0033771133299796345], "isController": false}, {"data": ["Open Home Page-0", 16, 0, 0.0, 169.4375, 15, 1574, 34.0, 960.8000000000006, 1574.0, 1574.0, 0.00864094186266303, 0.22096635095725434, 0.0030462695433802283], "isController": false}, {"data": ["SelectDate_1/2021/05/25/default-106-0", 16, 0, 0.0, 41.9375, 21, 62, 41.5, 57.10000000000001, 62.0, 62.0, 0.008650654665325094, 0.28274293065797423, 0.009799569738063584], "isController": false}, {"data": ["1/api/posts/9ed63028-d56a-471e-aa34-0f6540c99f7c-125", 756, 0, 0.0, 11.236772486772466, 2, 872, 4.0, 16.300000000000068, 22.0, 149.2799999999952, 0.3804437806248437, 0.2677432865008381, 0.46217974911846244], "isController": false}, {"data": ["ClickLoginIn -1", 16, 0, 0.0, 269.99999999999994, 258, 392, 261.5, 303.80000000000007, 392.0, 392.0, 0.008649195651833117, 0.009215109820458915, 0.0033701455713685676], "isController": false}, {"data": ["ClickLoginIn -2", 16, 0, 0.0, 13.062500000000002, 4, 25, 14.0, 22.900000000000002, 25.0, 25.0, 0.008650336633256544, 0.033904419997631975, 0.003269219020576448], "isController": false}, {"data": ["ClickLoginIn -0", 16, 0, 0.0, 17.1875, 3, 100, 5.0, 95.80000000000001, 100.0, 100.0, 0.008649929773382652, 0.038333380187119605, 0.0032606180591071322], "isController": false}, {"data": ["1/api/posts/9ed63028-d56a-471e-aa34-0f6540c99f7c-121", 756, 0, 0.0, 10.400793650793657, 2, 721, 4.0, 12.300000000000068, 19.149999999999977, 35.28999999999985, 0.38032932696298477, 0.2677914559595241, 0.4620407058026886], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181", 16, 0, 0.0, 329.75000000000006, 137, 1547, 151.5, 1533.7, 1547.0, 1547.0, 0.008650575155115626, 7.55416544116852, 0.09521546149737131], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 97, 100.0, 1.4131701631701632], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6864, 97, "500/Internal Server Error", 97, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["UpdatePost", 756, 97, "500/Internal Server Error", 97, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
