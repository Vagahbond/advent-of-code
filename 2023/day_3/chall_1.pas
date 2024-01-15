program Challenge_1;

{$mode objfpc}


uses Sysutils;


const
    C_FNAME = 'inputs.txt';
type
    array2d = array of string;
var
    lines: array2d;
    res: integer;
    number_valid: boolean;
    composed_number: integer;
    turns_to_skip: integer;

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
var
    char_code: integer;
begin
    char_code := ord(c);
    if  ((char_code>57) or (char_code<48)) and (char_code<>46) and (char_code <> 140) then
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

function symbol_near(const inp: array2d; const x, y: integer): boolean;
var
    char_code, nx, ny: integer;
begin
    symbol_near:=false;

    for nx := x -1  to x + 1 do
    begin
        if ((nx>=Length(inp)) or (nx<0)) then
        begin
            writeln('Continuing on x...');
            continue;
        end;
        
        for ny:= y -1 to y + 1 do
        begin
            if ((ny>=Length(inp[0])) or (ny<0)) then
            begin
                writeln('Continuing on y...');
                continue;
            end;

            symbol_near := (symbol_near or (is_symbol(inp[nx, ny])));
                            writeln((is_symbol(inp[nx, ny])));

        end;
    end;
                writeln('');



end;

function parse_input(const inputText: array2d): integer;
var
    x, y: integer;
begin
    parse_input := 0;

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
                number_valid := false;
                composed_number := 0;

                while(is_number(inputText[x, y + turns_to_skip])) do
                begin
                    composed_number:= composed_number * 10 + (ord(inputText[x, y + turns_to_skip]) - 48);
                    if (symbol_near(inputText, x, y + turns_to_skip)) then 
                        number_valid := true;
                    inc(turns_to_skip);
                end;

                if (number_valid) then
                    parse_input := parse_input + composed_number;
            end;
        end;
    end;
end;

begin
    lines:= file_to_2d_array(C_FNAME);

    res := parse_input(lines);

    writeln(res);
    readln;
end.

