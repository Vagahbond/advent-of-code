program Challenge_1;

{$mode objfpc}

// function file_to_2d_array(const file_name: string): array2d;

uses
 Sysutils;

const
    C_FNAME = 'inputs.txt';
type
    array2d = array of string;
var
    tfIn: TextFile;
    s: string;
    lines: array2d;
    i: integer;

begin
    writeln('Reading the contents of file: ', C_FNAME);
    writeln('=========================================');

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
        writeln('File handling error occurred. Details: ', E.Message);
    end;

    writeln('=========================================');
    writeln('File ', C_FNAME, ' was probably read. Press enter to stop.');
    

    readln;
end.

