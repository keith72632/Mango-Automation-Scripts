/*
 * Pass the variable(key) for data point established in the Meta Data Point tab to 
 * this function. This can only take 'actual' data points. Can not take other Meta 
 * points.
 */
function get_last_value(dpoint)
{
    var list = [];
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);

    var mgd = dpoint.getStats(start.getTime(), fin.getTime()).lastValue;
    var gpm = mgd_to_gpm(mgd);
    return mgd;
}
/*
 * Logs the max flow in gallons per minute starting from $(date-1)T-00:00 to $(date)T-00:00. Operators will record this number
 * after clock hits midnight, so data must range from present time(00:00) to the midnight before.
 */
function getPeakFlow(dpoint)
{
    var list = [];
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);

    var mgd = dpoint.getStats(start.getTime(), fin.getTime()).maximumValue;
    var gpm = mgd_to_gpm(mgd);
    return gpm;
}


//gets the amount of fluoride fed within the last 24 hours in pounds.
function fluoride_used(dpoint)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);

    var first = dpoint.getStats(start.getTime(), fin.getTime()).firstValue;
    var last = dpoint.getStats(start.getTime(), fin.getTime()).lastValue;
    var first_int = float_to_int(first);
    var last_int = float_to_int(last);
    var result = (first_int - last_int);
    return result;
}

function lime_used(dpoint, concentration)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);

    var first = dpoint.getStats(start.getTime(), fin.getTime()).firstValue;
    var last = dpoint.getStats(start.getTime(), fin.getTime()).lastValue;
    var result = (first - last);
    return (((result * 587) * 10.5) * concentration);
}

//This is the last fluoride weight value registered(T00:00)
function chem_level(dpoint)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);

    var last = dpoint.getStats(start.getTime(), fin.getTime()).lastValue;
 
    return last;
}


//Calculates the amount of ammonia fed for the previous 24 hours
function ammonia_used(finish_meter, chlorine_res)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);
    
    var first_fin_reading = finish_meter.getStats(start.getTime(), fin.getTime()).firstValue;
    var last_fin_reading = finish_meter.getStats(start.getTime(), fin.getTime()).lastValue;
    
    var finish_flow_total = (last_fin_reading - first_fin_reading) / 1000;
    
    var chlorine_avg = chlorine_res.getStats(start.getTime(), fin.getTime()).average;
    
    var ammonia_total =(finish_flow_total * chlorine_avg * 8.34) / 3;
    
    return ammonia_total;

}

//Calculates the amount of chlorine fed during previous 24 hours
function chlorine_used(dpoint, residual)
{
    var flow = total_flow(dpoint);
    
    return flow * residual * 8.34;
}

function get_chlorine_low(dpoint)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);
    
    var chlorine_avg = dpoint.getStats(start.getTime(), fin.getTime()).average;
    
    return (chlorine_avg * 0.75);
}

//Lowest clearwell reading over 24 hour period
function clearwell_low(dpoint)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);

    var low = dpoint.getStats(start.getTime(), fin.getTime()).minimumValue;
    return low;
}

//calculates the total flow for any given meter during previous 24 hours
function total_flow(dpoint)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);
    
    var first_reading = dpoint.getStats(start.getTime(), fin.getTime()).firstValue;
    var last_reading = dpoint.getStats(start.getTime(), fin.getTime()).lastValue;
    
    var flow_total = (last_reading - first_reading) / 1000;
    
    return flow_total;
}

function hours_run(dpoint)
{
    var list = [];
    var minutes = 0;
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);
    
    var vals = dpoint.pointValuesBetween(start.getTime(), fin.getTime());
    
    for(var i = 0; i < vals.length; i++)
    {
        if(vals[i])
        {
            minutes++;
        }
    }
    return (minutes / 60);
}

/**********************************************************************
 *                      Utility Functions                             *
 **********************************************************************/
 
 function mgd_to_gpm(value)
{
    return (value * 1000000) / 1440;
}

function float_to_int(dec_num)
{
    var str = dec_num.toString();
    var whole_num = str.split('.');
    return parseInt(whole_num[0]);
}

//returns data point's lowest value for previous day
function get_prev_low(dpoint)
{
    var end = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    end.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(end.getTime() - day_range);

    var low = dpoint.getStats(start.getTime(), end.getTime()).minimumValue;
    return low;
}

//returns average for data point during previous 24 hours
function get_prev_avg(dpoint)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);
    
    var chlorine_avg = dpoint.getStats(start.getTime(), fin.getTime()).average;
    
    return chlorine_avg;
}