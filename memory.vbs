' Memory.vbs
' Sample VBScript to discover how much RAM in computer
' Author Guy Thomas http://computerperformance.co.uk/
' Version 1.3 - August 2010
' -------------------------------------------------------' 

Option Explicit
Dim objWMIService, perfData, entry 
Dim strLogonUser, strComputer 

strComputer = "." 

Set objWMIService = GetObject("winmgmts:" _
& "{impersonationLevel=impersonate}!\\" _ 
& strComputer & "\root\cimv2") 
Set perfData = objWMIService.ExecQuery _
("Select * from Win32_PerfFormattedData_PerfOS_Memory") 

For Each entry in perfData 
Wscript.Echo "Available memory bytes: " & entry.AvailableBytes
Next

WScript.Quit
