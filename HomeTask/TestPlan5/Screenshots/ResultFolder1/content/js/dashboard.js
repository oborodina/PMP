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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9955307262569832, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Open Home Page-16"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-17"], "isController": false}, {"data": [0.4375, 500, 1500, "Open Home Page"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-18"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-19"], "isController": false}, {"data": [1.0, 500, 1500, "SelectMonth"], "isController": true}, {"data": [1.0, 500, 1500, "UpdatePost"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-10"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-11"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-12"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-13"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-14"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-15"], "isController": false}, {"data": [1.0, 500, 1500, "ClickLoginIn "], "isController": false}, {"data": [0.0, 500, 1500, "8.Editor"], "isController": true}, {"data": [1.0, 500, 1500, "ClickLogin"], "isController": true}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-3"], "isController": false}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-4"], "isController": false}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-5"], "isController": false}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-6"], "isController": false}, {"data": [0.875, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-0"], "isController": false}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-1"], "isController": false}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-2"], "isController": false}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-7"], "isController": false}, {"data": [1.0, 500, 1500, "Updated"], "isController": true}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-8"], "isController": false}, {"data": [1.0, 500, 1500, "12/admin/app/editor/editpost.cshtml-181-9"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-20"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-21"], "isController": false}, {"data": [1.0, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "ClickCalendarMonthJune"], "isController": false}, {"data": [1.0, 500, 1500, "OpenPost_1/post/test122-107"], "isController": false}, {"data": [1.0, 500, 1500, "SelectPredefinedDate"], "isController": true}, {"data": [1.0, 500, 1500, "1/api/customfields-123"], "isController": false}, {"data": [1.0, 500, 1500, "SelectDate_1/2021/05/25/default-106"], "isController": false}, {"data": [1.0, 500, 1500, "1/api/customfields-122"], "isController": false}, {"data": [1.0, 500, 1500, "1/api/customfields-126"], "isController": false}, {"data": [1.0, 500, 1500, "OpenPost_1/post/test122-107-1"], "isController": false}, {"data": [1.0, 500, 1500, "OpenPost_1/post/test122-107-0"], "isController": false}, {"data": [1.0, 500, 1500, "ClickLoginIn -5"], "isController": false}, {"data": [1.0, 500, 1500, "ClickLoginIn -3"], "isController": false}, {"data": [1.0, 500, 1500, "ClickLoginIn -4"], "isController": false}, {"data": [1.0, 500, 1500, "ClickCalendarMonthMay"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-5"], "isController": false}, {"data": [0.9973614775725593, 500, 1500, "ClickEdit"], "isController": true}, {"data": [1.0, 500, 1500, "Open Home Page-6"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-3"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-4"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-9"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-7"], "isController": false}, {"data": [1.0, 500, 1500, "OpenRandomPost"], "isController": true}, {"data": [1.0, 500, 1500, "Open Home Page-8"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page-1"], "isController": false}, {"data": [1.0, 500, 1500, "SelectDate_1/2021/05/25/default-106-1"], "isController": false}, {"data": [0.5, 500, 1500, "Open Home Page-2"], "isController": false}, {"data": [0.875, 500, 1500, "Open Home Page-0"], "isController": false}, {"data": [1.0, 500, 1500, "SelectDate_1/2021/05/25/default-106-0"], "isController": false}, {"data": [1.0, 500, 1500, "1/api/posts/9ed63028-d56a-471e-aa34-0f6540c99f7c-125"], "isController": false}, {"data": [1.0, 500, 1500, "ClickLoginIn -1"], "isController": false}, {"data": [1.0, 500, 1500, "ClickLoginIn -2"], "isController": false}, {"data": [1.0, 500, 1500, "ClickLoginIn -0"], "isController": false}, {"data": [1.0, 500, 1500, "1/api/posts/9ed63028-d56a-471e-aa34-0f6540c99f7c-121"], "isController": false}, {"data": [0.875, 500, 1500, "12/admin/app/editor/editpost.cshtml-181"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3437, 0, 0.0, 22.970904858888527, 1, 3612, 10.0, 33.0, 47.0, 261.6199999999999, 1.7192220732707737, 14.652534924043097, 2.794022610590198], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Open Home Page-16", 8, 0, 0.0, 14.375, 4, 39, 11.0, 39.0, 39.0, 39.0, 0.004337298708677742, 0.009072747884753636, 0.0016984929513474362], "isController": false}, {"data": ["Open Home Page-17", 8, 0, 0.0, 10.25, 4, 20, 9.5, 20.0, 20.0, 20.0, 0.004337322224005343, 0.09886892124290306, 0.001994998796393083], "isController": false}, {"data": ["Open Home Page", 16, 0, 0.0, 1116.75, 614, 3612, 781.5, 3612.0, 3612.0, 3612.0, 0.008656739190302722, 2.6722631076557497, 0.07456292935397461], "isController": false}, {"data": ["Open Home Page-18", 8, 0, 0.0, 12.375, 3, 34, 9.0, 34.0, 34.0, 34.0, 0.004337326927101461, 0.0035579634948879183, 0.0016688543059355234], "isController": false}, {"data": ["Open Home Page-19", 8, 0, 0.0, 256.12500000000006, 247, 299, 250.5, 299.0, 299.0, 299.0, 0.004336767330264347, 0.006246808410292883, 0.0017702819766118138], "isController": false}, {"data": ["SelectMonth", 379, 0, 0.0, 39.701846965699225, 21, 136, 31.0, 67.0, 75.0, 90.79999999999995, 0.19043082587688623, 2.099202307127238, 1.058527598526598], "isController": true}, {"data": ["UpdatePost", 379, 0, 0.0, 31.55408970976254, 18, 78, 26.0, 51.0, 57.0, 66.59999999999997, 0.19070717642678153, 0.03389522081022875, 0.3345935631925086], "isController": false}, {"data": ["Open Home Page-10", 8, 0, 0.0, 11.749999999999998, 5, 20, 12.5, 20.0, 20.0, 20.0, 0.004337282248100135, 0.04240286385325239, 0.0016815439965778844], "isController": false}, {"data": ["Open Home Page-11", 8, 0, 0.0, 13.999999999999998, 4, 30, 12.0, 30.0, 30.0, 30.0, 0.004337284599603573, 0.013003382539827116, 0.0016476598723103415], "isController": false}, {"data": ["Open Home Page-12", 8, 0, 0.0, 13.124999999999998, 5, 31, 12.0, 31.0, 31.0, 31.0, 0.004337268139133056, 0.1048526101408582, 0.0016137687119235297], "isController": false}, {"data": ["Login-0", 8, 0, 0.0, 10.500000000000002, 3, 22, 10.5, 22.0, 22.0, 22.0, 0.004337964290962447, 0.00493104534636747, 0.004638741111917852], "isController": false}, {"data": ["Open Home Page-13", 8, 0, 0.0, 13.625, 6, 26, 11.0, 26.0, 26.0, 26.0, 0.004337286951109559, 0.1287928557835824, 0.0017154308742181362], "isController": false}, {"data": ["Open Home Page-14", 8, 0, 0.0, 17.875, 4, 60, 11.0, 60.0, 60.0, 60.0, 0.004337298708677742, 0.1882277512841115, 0.0017111998811580155], "isController": false}, {"data": ["Logout-0", 7, 0, 0.0, 12.000000000000002, 4, 27, 6.0, 27.0, 27.0, 27.0, 0.004436340728713329, 0.0020838670805772568, 0.005393793171140716], "isController": false}, {"data": ["Open Home Page-15", 8, 0, 0.0, 14.375, 3, 48, 9.5, 48.0, 48.0, 48.0, 0.004337305763249249, 0.011567560585384473, 0.001736616565363469], "isController": false}, {"data": ["ClickLoginIn ", 8, 0, 0.0, 280.0, 263, 352, 266.5, 352.0, 352.0, 352.0, 0.0043370894334948, 0.4565676070922255, 0.009949045975858675], "isController": false}, {"data": ["8.Editor", 7, 0, 0.0, 6053.142857142857, 4642, 8499, 5880.0, 8499.0, 8499.0, 8499.0, 0.004410885308790327, 8.249668085803377, 3.0736590918507005], "isController": true}, {"data": ["ClickLogin", 8, 0, 0.0, 280.0, 263, 352, 266.5, 352.0, 352.0, 352.0, 0.004337075325782124, 0.45656612196614804, 0.009949013613537314], "isController": true}, {"data": ["12/admin/app/editor/editpost.cshtml-181-3", 8, 0, 0.0, 18.625000000000004, 13, 30, 17.5, 30.0, 30.0, 30.0, 0.004342268455319415, 0.5172769702364637, 0.005097076839154235], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-4", 8, 0, 0.0, 10.624999999999998, 4, 33, 8.0, 33.0, 33.0, 33.0, 0.004342273169148367, 0.1341228106122985, 0.005046196358678277], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-5", 8, 0, 0.0, 18.5, 8, 41, 15.5, 41.0, 41.0, 41.0, 0.004342266098408777, 0.026524291450729393, 0.005054669130178967], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-6", 8, 0, 0.0, 21.75, 13, 34, 22.5, 34.0, 34.0, 34.0, 0.00434224488632817, 0.02009984449335501, 0.005097049173209435], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-0", 8, 0, 0.0, 209.625, 11, 1564, 17.5, 1564.0, 1564.0, 1564.0, 0.004338613606868459, 0.09630112174854806, 0.005219894495763615], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-1", 8, 0, 0.0, 135.37500000000003, 131, 142, 134.5, 142.0, 142.0, 142.0, 0.004341992714136225, 0.004846579758064166, 0.001785135676417335], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-2", 8, 0, 0.0, 28.375, 8, 67, 25.5, 67.0, 67.0, 67.0, 0.0043422401725606245, 0.655839403875558, 0.005186093487345355], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-7", 8, 0, 0.0, 26.5, 14, 38, 26.0, 38.0, 38.0, 38.0, 0.004342296738446641, 1.586558189761624, 0.005181920521857222], "isController": false}, {"data": ["Updated", 379, 0, 0.0, 43.374670184696576, 24, 113, 36.0, 71.0, 77.0, 98.19999999999999, 0.19070660066239095, 0.20097125214356232, 0.8099694029751237], "isController": true}, {"data": ["12/admin/app/editor/editpost.cshtml-181-8", 8, 0, 0.0, 31.249999999999996, 20, 80, 23.5, 80.0, 80.0, 80.0, 0.0043422849537655215, 1.381296109638353, 0.005071653129593324], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181-9", 8, 0, 0.0, 18.125, 10, 32, 15.0, 32.0, 32.0, 32.0, 0.004342322664970266, 0.006398989161562628, 0.00505049442771444], "isController": false}, {"data": ["Open Home Page-20", 8, 0, 0.0, 225.62499999999997, 28, 285, 249.5, 285.0, 285.0, 285.0, 0.004337381013439917, 0.008657819132296084, 0.0017705324840018412], "isController": false}, {"data": ["Open Home Page-21", 8, 0, 0.0, 226.875, 58, 285, 245.5, 285.0, 285.0, 285.0, 0.004337425694476072, 0.0074634219469402715, 0.0017705507229404276], "isController": false}, {"data": ["Login", 16, 0, 0.0, 10.5, 3, 22, 10.5, 22.0, 22.0, 22.0, 0.008674517466411997, 0.009860486651273013, 0.009275973267305799], "isController": false}, {"data": ["ClickCalendarMonthJune", 379, 0, 0.0, 20.406332453825858, 10, 98, 16.0, 35.0, 44.0, 55.19999999999993, 0.19043273955835685, 0.9469565525694854, 0.4747800625903174], "isController": false}, {"data": ["OpenPost_1/post/test122-107", 8, 0, 0.0, 66.5, 27, 229, 42.0, 229.0, 229.0, 229.0, 0.004338096020501842, 0.14841033182638724, 0.010029728836463], "isController": false}, {"data": ["SelectPredefinedDate", 379, 0, 0.0, 1.0580474934036945, 0, 114, 0.0, 0.0, 0.0, 47.39999999999992, 0.19044001189873214, 0.19174037580748576, 0.009119231275576244], "isController": true}, {"data": ["1/api/customfields-123", 379, 0, 0.0, 7.224274406332461, 3, 80, 4.0, 18.0, 23.0, 36.99999999999994, 0.19070161084996562, 0.043019601666349674, 0.24508136706890116], "isController": false}, {"data": ["SelectDate_1/2021/05/25/default-106", 8, 0, 0.0, 50.125, 27, 114, 44.5, 114.0, 114.0, 114.0, 0.004337945473109889, 0.2069134328412838, 0.009840866537142844], "isController": false}, {"data": ["1/api/customfields-122", 379, 0, 0.0, 6.691292875989445, 2, 64, 4.0, 16.0, 22.0, 34.19999999999993, 0.19070765623309607, 0.0430209654197707, 0.2333561457617865], "isController": false}, {"data": ["1/api/customfields-126", 378, 0, 0.0, 4.798941798941795, 1, 33, 3.0, 12.100000000000023, 17.0, 26.0, 0.1907133689062538, 0.03389632142669745, 0.24435150391113766], "isController": false}, {"data": ["OpenPost_1/post/test122-107-1", 8, 0, 0.0, 5.0, 3, 9, 4.5, 9.0, 9.0, 9.0, 0.004338613606868459, 0.012007452111196498, 0.005063128183796688], "isController": false}, {"data": ["OpenPost_1/post/test122-107-0", 8, 0, 0.0, 56.5, 22, 212, 32.0, 212.0, 212.0, 212.0, 0.004338112487256794, 0.1364048299459905, 0.004967223526668547], "isController": false}, {"data": ["ClickLoginIn -5", 8, 0, 0.0, 11.5, 8, 21, 9.0, 21.0, 21.0, 21.0, 0.004337879611911601, 0.03171650845154507, 0.0016775393811689393], "isController": false}, {"data": ["ClickLoginIn -3", 8, 0, 0.0, 12.625, 6, 27, 12.5, 27.0, 27.0, 27.0, 0.004337900781364378, 0.35875371432754405, 0.0016733113365614545], "isController": false}, {"data": ["ClickLoginIn -4", 8, 0, 0.0, 11.75, 3, 24, 10.0, 24.0, 24.0, 24.0, 0.0043378749076168205, 0.017334554806609403, 0.0016351755022852468], "isController": false}, {"data": ["ClickCalendarMonthMay", 379, 0, 0.0, 19.295514511873368, 10, 66, 15.0, 36.0, 44.0, 52.19999999999999, 0.1904383851427911, 1.152301010102279, 0.5837754794562707], "isController": false}, {"data": ["Logout", 14, 0, 0.0, 12.000000000000002, 4, 27, 6.0, 27.0, 27.0, 27.0, 0.008870994825041804, 0.004166941905122176, 0.01078553570036821], "isController": false}, {"data": ["Open Home Page-5", 8, 0, 0.0, 14.875, 7, 29, 13.5, 29.0, 29.0, 29.0, 0.004337112946553215, 0.026785060814455596, 0.001711126592194823], "isController": false}, {"data": ["ClickEdit", 379, 0, 0.0, 29.063324538258616, 9, 2290, 13.0, 45.0, 54.0, 199.5999999999999, 0.19047054265007346, 4.3201956860243875, 0.7534951964924774], "isController": true}, {"data": ["Open Home Page-6", 8, 0, 0.0, 15.625, 7, 36, 13.5, 36.0, 36.0, 36.0, 0.004337112946553215, 0.012232013857075863, 0.00174501028708977], "isController": false}, {"data": ["Open Home Page-3", 8, 0, 0.0, 15.749999999999998, 9, 27, 15.0, 27.0, 27.0, 27.0, 0.004337091784789169, 0.1085797705027882, 0.0016857055960411026], "isController": false}, {"data": ["Open Home Page-4", 8, 0, 0.0, 12.750000000000002, 7, 21, 12.5, 21.0, 21.0, 21.0, 0.004337108243921136, 0.01664111161168569, 0.0016730056214344226], "isController": false}, {"data": ["Open Home Page-9", 8, 0, 0.0, 12.375, 5, 20, 12.5, 20.0, 20.0, 20.0, 0.004337272842111883, 0.010728820419013086, 0.0016645978778808302], "isController": false}, {"data": ["Open Home Page-7", 8, 0, 0.0, 18.5, 11, 45, 15.0, 45.0, 45.0, 45.0, 0.004337124703178028, 0.005972017413555683, 0.0015713606102334458], "isController": false}, {"data": ["OpenRandomPost", 379, 0, 0.0, 1.4036939313984163, 0, 229, 0.0, 0.0, 0.0, 48.39999999999992, 0.1904514956723792, 0.13753085414732, 0.009294482107609617], "isController": true}, {"data": ["Open Home Page-8", 8, 0, 0.0, 15.0, 6, 33, 13.0, 33.0, 33.0, 33.0, 0.004337249327319737, 0.3936477324047282, 0.0016772956382994295], "isController": false}, {"data": ["Open Home Page-1", 8, 0, 0.0, 11.125, 5, 30, 8.5, 30.0, 30.0, 30.0, 0.004337108243921136, 0.0226554609343107, 0.001626415591470426], "isController": false}, {"data": ["SelectDate_1/2021/05/25/default-106-1", 8, 0, 0.0, 4.75, 3, 9, 4.0, 9.0, 9.0, 9.0, 0.004338192470416239, 0.06503899492756846, 0.004927068206146568], "isController": false}, {"data": ["Open Home Page-2", 8, 0, 0.0, 753.1250000000001, 569, 1002, 743.5, 1002.0, 1002.0, 1002.0, 0.004335329029796717, 0.0067702471042711656, 0.0016934879022643423], "isController": false}, {"data": ["Open Home Page-0", 8, 0, 0.0, 350.62500000000006, 24, 2529, 41.5, 2529.0, 2529.0, 2529.0, 0.00433100577864446, 0.1119807132530401, 0.0015268487168854006], "isController": false}, {"data": ["SelectDate_1/2021/05/25/default-106-0", 8, 0, 0.0, 40.875, 22, 88, 35.5, 88.0, 88.0, 88.0, 0.004337959586484003, 0.14187860253987533, 0.004914094844063909], "isController": false}, {"data": ["1/api/posts/9ed63028-d56a-471e-aa34-0f6540c99f7c-125", 379, 0, 0.0, 7.03430079155673, 3, 90, 4.0, 17.0, 23.0, 28.399999999999977, 0.1907120705644725, 0.13327427072131934, 0.2316853669748084], "isController": false}, {"data": ["ClickLoginIn -1", 8, 0, 0.0, 262.0, 259, 268, 261.0, 268.0, 268.0, 268.0, 0.004337286951109559, 0.004621074280918486, 0.0016900170834889786], "isController": false}, {"data": ["ClickLoginIn -2", 8, 0, 0.0, 10.25, 4, 24, 9.0, 24.0, 24.0, 24.0, 0.004337879611911601, 0.025002114716310805, 0.0016394134861423724], "isController": false}, {"data": ["ClickLoginIn -0", 8, 0, 0.0, 16.75, 3, 82, 5.0, 82.0, 82.0, 82.0, 0.00433770555979988, 0.019223152178097516, 0.0016351116660964391], "isController": false}, {"data": ["1/api/posts/9ed63028-d56a-471e-aa34-0f6540c99f7c-121", 379, 0, 0.0, 7.833773087071232, 2, 470, 4.0, 14.0, 20.0, 36.0, 0.1906526861404049, 0.1332877915816527, 0.2316132241783825], "isController": false}, {"data": ["12/admin/app/editor/editpost.cshtml-181", 8, 0, 0.0, 346.50000000000006, 143, 1701, 155.5, 1701.0, 1701.0, 1701.0, 0.004338303040228542, 4.425289405484374, 0.04775098981095302], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3437, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
