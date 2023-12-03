program Challenge_1;

{$mode objfpc}


uses Sysutils;


const
    C_FNAME = 'inputs.txt';
type
    array2d = array of string;
    coordsArray = array of array of integer;
    coords = array[0..1] of integer;
    coordsList = array of coords;
var
    lines: array2d;
    res, i, j: integer;
    composed_number: integer;
    turns_to_skip: integer;
    values: coordsArray;
    nb_ops: coordsArray;
    current_coords: coordsList;
    current_coords_cache: coordsList;
    exists: boolean;

function file_to_2d_array(const file_name: string): array2d;
var
    tfIn: TextFile;
    s: string;
    lines: array2d;
    i: integer;
begin
    AssignFile(tfIn, C_FNAME);
    try
        reset(tfIn);

        i:= 0;
        while not eof(tfIn) do
        begin
            readln(tfIn, s);
            setLength(lines, i + 1);
            setLength(lines[i + 1], Length(s)); 
            lines[i]:= s;
            inc(i);
        end;
        CloseFile(tfIn);
    except
        on E: EInOutError do
    end;

    file_to_2d_array := lines;
end;

function is_symbol(const c: char): boolean;
begin
    if  (c = '*') then 
        is_symbol := true
    else
        is_symbol := false

end;

function is_number(const c: char): boolean;
var
    char_code: integer;
begin
    char_code := ord(c);
    if  (char_code<=57) and (char_code>=48)  then
        is_number := true
    else
        is_number := false

end;

function symbol_near(const inp: array2d; const x, y: integer): coordsList;
var
    nx, ny, nb_gears: integer;

begin
    nb_gears:=0;
    setLength(symbol_near, 0);

    for nx := x -1  to x + 1 do
    begin
        if ((nx>=Length(inp)) or (nx<0)) then
        begin
            continue;
        end;
        
        for ny:= y -1 to y + 1 do
        begin
            if ((ny>=Length(inp[0])) or (ny<0)) then
            begin
                continue;
            end;
            if (is_symbol(inp[nx, ny])) then
            begin
                inc(nb_gears);
                setLength(symbol_near, nb_gears);
                symbol_near[nb_gears-1][0] := nx;                            
                symbol_near[nb_gears-1][1] := ny;
            end;
        end;
    end;
end;

function parse_input(const inputText: array2d): integer;
var
    x, y: integer;
begin
    parse_input := 0;

    for x := 0 to Length(inputText)-1 do
    begin
        setLength(values, x + 1);
        setLength(nb_ops, x + 1);
        setLength(values[x], Length(inputText[0]));
        setLength(nb_ops[x], Length(inputText[0]));
    
        for y:= 0 to Length(inputText[0])-1 do
        begin
            values[x, y] := 1;
            nb_ops[x, y] := 0;
        end;
    end; 


    for x := 0 to Length(inputText)-1 do
    begin
        for y:= 0 to Length(inputText[0])-1 do
        begin
            if (turns_to_skip > 0) then
            begin
                dec(turns_to_skip);
                continue;
            end;

            if (is_number(inputText[x, y])) then
            begin
                composed_number:=0;
                
                setLength(current_coords, 0);
                while(is_number(inputText[x, y + turns_to_skip])) do
                begin
                    composed_number:= composed_number * 10 + (ord(inputText[x, y + turns_to_skip]) - 48);
                    current_coords_cache := symbol_near(inputText, x, y + turns_to_skip);

                    for i := 0 to Length(current_coords_cache)-1 do
                    begin
                        exists := false;

                                writeln('while parsing :  ',  composed_number);
                                writeln('harvested :  ',  current_coords_cache[i][0] , current_coords_cache[i][1]);
                        for j := 0 to Length(current_coords)-1 do
                        begin
                            if (current_coords[j][0] = current_coords_cache[i][0]) and (current_coords[j][1] = current_coords_cache[i][1]) then
                            begin
                                exists := true;

                            end;
                        end;

                        if not exists then
                        begin
                            setLength(current_coords, Length(current_coords) + 1);
                            current_coords[Length(current_coords) - 1] := current_coords_cache[i];
                        end;
                    end;
                    
                    inc(turns_to_skip);
                end;

                for i := 0 to Length(current_coords)-1 do
                begin
                    if (nb_ops[current_coords[i][0], current_coords[i][1]]<2) then
                    begin
                        values[current_coords[i][0], current_coords[i][1]] := values[current_coords[i][0], current_coords[i][1]] * composed_number;
                        inc(nb_ops[current_coords[i][0], current_coords[i][1]]);
                    end;
                end;
            end;
        end;
    end;

    parse_input := 0;
    for x := 0 to Length(inputText)-1 do
    begin
        for y:= 0 to Length(inputText[0])-1 do
        begin
            write(nb_ops[x, y]);
            if (nb_ops[x, y] = 2) then
                parse_input:= parse_input + values[x, y];
        end;
        writeln('');
    end;

end;

begin
    lines:= file_to_2d_array(C_FNAME);

    res := parse_input(lines);

    writeln(res);
    readln;
end.

