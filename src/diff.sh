#for key in "${!fixmsg1[@]}"; do
                #      echo "$key : ${fixmsg1[$key]}"
                #done             
#!/bin/bash
file_path="/Users/hasan/Desktop/FixMessageDifference/src/TORAUAT_AUTEXTST_2023_06_27.log"
declare -a messages
# Read each line from the file and store it in the array
while IFS= read -r line; do
    messages+=("$line")
done < "$file_path"

for fix_msg1_raw in "${messages[@]}"; do

        if [[ ${fix_msg1_raw} == *"58=REDI"* || ${fix_msg1_raw} == *"58=TORA"* ]]; then
                fix_msg1_raw=${fix_msg1_raw:33:((${#fix_msg1_raw}-35))}
                fix_msg1_raw=$(echo "${fix_msg1_raw}" | sed "s/\\x01/|/g")
                # echo "${fix_msg1_raw}"
                declare -A fixmsg1
                IFS="|" read -ra tagValuePair <<< "${fix_msg1_raw}"
                for pair in "${tagValuePair[@]}"; do
                       IFS="=" read -r key value <<< "$pair"
                       fixmsg1["$key"]="$value"
                done

                if [[ "${fixmsg1["58"]:0:4}" == "TORA" ]]; then
                    toSearchtag58="REDI${fixmsg1["58"]:4}"
                else
                    toSearchtag58="TORA${fixmsg1["58"]:4}"
                fi
                echo "toSearchtag58: $toSearchtag58"

                for fix_msg2_raw in "${messages[@]}"; do
                    if [[ ${fix_msg2_raw} == *"58=REDI"* || ${fix_msg2_raw} == *"58=TORA"* ]]; then
                        declare -A fixmsg2
                        IFS="|" read -ra tagValuePair <<< "${fix_msg2_raw}"
                        for pair in "${tagValuePair[@]}"; do
                            IFS="=" read -r key value <<< "$pair"
                            fixmsg2["$key"]="$value"
                        done 

                        if [[ ${fixmsg1["35"]} == ${fixmsg2["35"]} && ${fixmsg1["58"]} == toSearchtag58 ]]; then
                            echo "tag35 ${fixmsg1["35"]} | tag35 ${fixmsg2["35"]}"
                            echo "tag58 ${fixmsg1["58"]} | tag58 ${fixmsg2["58"]}"
                        fi
                    fi
                done
                
                
        fi
done