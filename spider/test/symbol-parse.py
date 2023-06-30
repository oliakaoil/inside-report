import re

fixtures = [
    "N/A", # no symbol

    # multiple companies?
    "MOGA/MOGB",
    "UHAL,UHALB",
    "CRDA CRDB",    
    "BBXIA/B",
    "BCDA;BCDAW",
    "GEF, GEFB",
    "HEI, HEI.A",
    "WSO; WSOB",
    "LEN, LEN.B",

    # how to deal with a/b listing?

    # market prefix?
    "(NYSE:FBC)",
    "NYSE: SCS",
    "ASX:CRN", # australia

    # cleanup
    "(LUMO)",
    "[EXFY]",

    # one-offs
    "Z AND ZG",    

    # spaces between each individal letter, typo?
    "N O G",
    
    "M-6697", # japan

    # regular
    "META",
    "GOOG",
    "MSFT"
]

# { $and: [{"meta.symbol": /.*[^0-9\.A-Za-z]+.*/}, {"meta.symbol": {$nin: ["MOGA/MOGB","Z AND ZG","UHAL,UHALB","N/A","[EXFY]","CRDA CRDB","N O G","FRG FRGAP","NYSE: SCS","GEF, GEFB","PARAA,PARA","(CALX)"]  }  }] }
# { $and: [{"meta.symbol": /^.*AND.*$/}, {"meta.symbol": {$nin: ["Z AND ZG","BAND"]  }} ] }

def get_symbols(val):
    val = str(val).upper().strip()

    # cleanup parenthesis and brackets
    if re.search("^(\(|\[).+(\)|\])$", val):
        val = val[1:len(val) - 1]

    # not applicable
    if val == "N/A":
        val = "no-symbol"

    # market prefix
    if re.search("^NYSE: *.+",val):
        val = re.sub("^NYSE: *","",val)

    # one-offs
    if re.search("^.+ AND .+$",val):
        val = val.split(" AND ")

    # delimited list
    if type(val) is str:
        m_regex = "(;|,|/)"
        multiple = re.split(m_regex,val)
        if len(multiple) > 1:
            val = [m.strip() for m in multiple if not re.search(m_regex, m)]

    return val if type(val) is list else [val]


def main():
    for fixture in fixtures:
        print(f"{fixture} => {get_symbols(fixture)}")


if __name__ == '__main__':
    main()