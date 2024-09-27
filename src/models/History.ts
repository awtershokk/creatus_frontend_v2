export interface TableEntry {
    x: number;
    y: string | number;
}

export interface TableHead {
    module: string;
    group: string;
    label: string;
}

export interface TableData {
    head: TableHead;
    table: TableEntry[];
}

export interface HistoryTableProps {
    data: TableData[];
}
