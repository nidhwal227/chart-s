import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useQuery } from 'react-query'
import axios from "axios";
import * as echarts from 'echarts';
function splitData(raw) {
    const rawData = raw.map(l => [...l]);
    const categoryData = [];
    const volumes = []
    const values = [];
    const valClose = [];
    for (let i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        volumes.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i]);
        valClose.push(rawData[i][1]);
    }
    return {
        categoryData: categoryData,
        values: values,
        valClose: valClose,
        volumes: volumes
    };
}


function getOutputsize(displayRecent) {
    if (displayRecent) {
        return "compact";
    }
    return "full";
}

function getZoomPosition(displayRecent) {
    if (displayRecent) {
        return 60;
    }
    return 98;
}

function calculateMA(dayCount, data) {
    let result = [];
    for (let i = 0, len = data.values.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        let sum = 0;
        for (let j = 0; j < dayCount; j++) {
            sum += +data.values[i - j][1];
        }
        result.push((sum / dayCount).toFixed(2));
    }
    return result;
}
const backendAPI = axios.create({ baseURL: "http://127.0.0.1:8000/" });

function MyChart({ symbol, displayRecent }) {

    console.log(symbol);
    const upColor = '#00da3c';
    const upBorderColor = '#008F28';
    const downColor = '#ec0000';
    const downBorderColor = '#8A0000';
    // Each item: open，close，lowest，highest

    // const { isLoading, error, data: data0 } = useQuery(['repoData', symbol, DisplayRecent], () =>
    //     fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&apikey=MRYEV0BP5ROJORBJ&' + new URLSearchParams({
    //         symbol: symbol,
    //         outputsize: getOutputsize(DisplayRecent)
    //     }, ))
    //         .then(res => res.json())
    //         .then(res => {
    //             console.log(res);
    //             const entries = Object.entries(res["Time Series (Daily)"]).map(([k, v]) =>
    //                 [k, +v["1. open"], +v["4. close"], +v["3. low"], +v["2. high"]]).reverse();
    //             return splitData(entries);
    //         })
    // )

    const { isLoading, error, data: dataset } = useQuery(['repoData', symbol, displayRecent], () => {
        return backendAPI.get('/util/data', {
            params: {
                symbol: symbol,
                outputsize: getOutputsize(displayRecent)
            }
        })
            .then(res => { console.log("bebong", res); return res })
            .then(res => {
                const entries = Object.entries(res.data["Time Series (Daily)"]).map(([k, v]) =>
                    [k, +v["5. volume"], +v["1. open"], +v["4. close"], +v["3. low"], +v["2. high"]]).sort();
                console.log("otto", entries)
                return splitData(entries);
            });
    })


    console.log("error", error, "data", dataset)

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message
    console.log("bebong", dataset);



    const option = {
        title: {
            text: symbol,
            left: '10%'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            position: function (pos, params, el, elRect, size) {
                var obj = { top: 10 };
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                return obj;
            },
            extraCssText: 'width: 170px'
        },
        axisPointer: {
            link: { xAxisIndex: 'all' },
            label: {
                backgroundColor: '#777'
            }
        },
        legend: {
            data: [symbol, 'Close', 'MA5', 'MA10', 'MA20', 'MA30']
        },
        grid: [
            {
                left: '12%',
                right: '10%',
                height: '60%'
            },
            {
                left: '12%',
                right: '10%',
                bottom: '20%',
                height: '10%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: dataset.categoryData,
                scale: true,
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    z: 100
                }
            },
            {
                type: 'category',
                gridIndex: 1,
                data: dataset.categoryData,
                scale: true,
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax'
            }
        ],
        yAxis: [
            {
                scale: true,
                splitArea: {
                    show: true
                }
            },
            {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1],
                start: getZoomPosition(displayRecent),
                end: 100
            },
            {
                show: true,
                xAxisIndex: [0, 1],
                type: 'slider',
                top: '85%',
                start: getZoomPosition(displayRecent),
                end: 100,
                backgroundColor: 'rgba(47,69,84,0)',
                dataBackground: {
                    areaStyle: {
                        color: 'rgba(70,70,100,10)'
                    }
                }
            }
        ],
        series: [
            {
                name: symbol,
                type: 'candlestick',
                data: dataset.values,
                itemStyle: {
                    color: upColor,
                    color0: downColor,
                    borderColor: upBorderColor,
                    borderColor0: downBorderColor
                }
            },
            {
                name: 'Close',
                type: 'line',
                data: dataset.valClose,
                smooth: true,
                lineStyle: {
                    opacity: 0.8
                },
                tooltip: {
                    show: false
                }
            },
            {
                name: 'MA5',
                type: 'line',
                data: calculateMA(5, dataset),
                smooth: true,
                lineStyle: {
                    opacity: 0.5
                }
            },
            {
                name: 'MA10',
                type: 'line',
                data: calculateMA(10, dataset),
                smooth: true,
                lineStyle: {
                    opacity: 0.5
                }
            },
            {
                name: 'MA20',
                type: 'line',
                data: calculateMA(20, dataset),
                smooth: true,
                lineStyle: {
                    opacity: 0.5
                }
            },
            {
                name: 'MA30',
                type: 'line',
                data: calculateMA(30, dataset),
                smooth: true,
                lineStyle: {
                    opacity: 0.5
                }
            },
            {
                name: 'Volume',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: dataset.volumes
            }
        ]
    };
    const style = {
        height: "90vh",
        width: "100%"
    };
    return (
        <ReactECharts option={option} style={style} className="my-chart" />
    )

}

export default MyChart;