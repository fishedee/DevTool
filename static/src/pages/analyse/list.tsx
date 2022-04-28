import { useCallback, useMemo, useRef, useState } from 'react';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { useLocation } from 'umi';
import { GridApi, ColumnApi } from 'ag-grid-community';

const Page: React.FC<any> = (props) => {
    const location = useLocation() as any;
    const state = location.state ? location.state : {};
    console.log('state',state);
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 150,
            resizable: true,
            sortable: true,
            unSortIcon: true,
            floatingFilter: true,
        };
    }, []);

    const autoGroupColumnDef = useMemo(() => {
        return {
            headerName: '分组',
            minWidth: 300,
        };
    }, []);

    const [statusBar] = useState({
        statusPanels: [
            {
                statusPanel: 'agTotalAndFilteredRowCountComponent',
                align: 'left',
            },
            { statusPanel: 'agAggregationComponent' },
        ]
    });

    const onGridReady = useCallback(() => {
    }, []);
    const [disabled, setDisabled] = useState(true);
    const ref = useRef<{ api: GridApi, columnApi: ColumnApi }>();
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                position:'absolute',
                gap:'15px',
                top:'0px',
                bottom:'0px',
                left:'0px',
                right:'0px',
                width:'100%',
                height:'100%',
                boxSizing: 'border-box',
            }}
            className="ag-theme-alpine" 
        >
            <AgGridReact
                ref={ref as any}
                rowData={state.list}
                columnDefs={state.column}
                defaultColDef={defaultColDef}
                //分组后，分组列数据是否保留，hide为false的话不需要设置这一个
                //showOpenedGroup={true}
                onGridReady={onGridReady}
                autoGroupColumnDef={autoGroupColumnDef}
                //打开自定义group面板，并保留列
                rowGroupPanelShow={'always'}
                suppressDragLeaveHidesColumns={true}
                suppressMakeColumnVisibleAfterUnGroup={true}
                //子合计，没啥用，别用
                //groupIncludeFooter={true}
                //主合计
                groupIncludeTotalFooter={true}
                //statusBar只能显示总数，以及圈起来部分的数据
                statusBar={statusBar}
                enableRangeSelection={true}
                //打开图表
                enableCharts={true}
                //打开sideBar
                sideBar={disabled}
            />
        </div>
    );
}

export default Page;