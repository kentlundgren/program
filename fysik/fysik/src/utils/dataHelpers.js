/**
 * dataHelpers.js - Funktioner för databearbetning i elektriska kretsar
 * 
 * Detta är en samling hjälpfunktioner för att utföra beräkningar 
 * relaterade till elektriska kretsar.
 */

/**
 * Beräknar den totala resistansen för seriekopplade resistorer
 * @param {Array<number>} resistors - Array med resistansvärden
 * @returns {number} - Total resistans
 */
export const calculateSeriesResistance = (resistors) => {
    // För seriekoppling adderas alla resistanser
    return resistors.reduce((total, current) => total + current, 0);
  };
  
  /**
   * Beräknar den totala resistansen för parallellkopplade resistorer
   * @param {Array<number>} resistors - Array med resistansvärden
   * @returns {number} - Total resistans
   */
  export const calculateParallelResistance = (resistors) => {
    // För parallellkoppling är 1/Rtot = 1/R1 + 1/R2 + ... + 1/Rn
    const reciprocalSum = resistors.reduce((sum, resistance) => sum + 1 / resistance, 0);
    return 1 / reciprocalSum;
  };
  
  /**
   * Beräknar strömmen givet spänning och resistans (Ohms lag)
   * @param {number} voltage - Spänning i volt
   * @param {number} resistance - Resistans i ohm
   * @returns {number} - Ström i ampere
   */
  export const calculateCurrent = (voltage, resistance) => {
    // I = U / R
    return voltage / resistance;
  };
  
  /**
   * Beräknar spänningen givet ström och resistans (Ohms lag)
   * @param {number} current - Ström i ampere
   * @param {number} resistance - Resistans i ohm
   * @returns {number} - Spänning i volt
   */
  export const calculateVoltage = (current, resistance) => {
    // U = I * R
    return current * resistance;
  };
  
  /**
   * Beräknar resistansen givet spänning och ström (Ohms lag)
   * @param {number} voltage - Spänning i volt
   * @param {number} current - Ström i ampere
   * @returns {number} - Resistans i ohm
   */
  export const calculateResistance = (voltage, current) => {
    // R = U / I
    return voltage / current;
  };
  
  /**
   * Beräknar effekten givet spänning och ström
   * @param {number} voltage - Spänning i volt
   * @param {number} current - Ström i ampere
   * @returns {number} - Effekt i watt
   */
  export const calculatePower = (voltage, current) => {
    // P = U * I
    return voltage * current;
  };
  
  /**
   * Beräknar effekten givet resistans och ström
   * @param {number} resistance - Resistans i ohm
   * @param {number} current - Ström i ampere
   * @returns {number} - Effekt i watt
   */
  export const calculatePowerFromCurrentAndResistance = (resistance, current) => {
    // P = I^2 * R
    return Math.pow(current, 2) * resistance;
  };
  
  /**
   * Beräknar effekten givet spänning och resistans
   * @param {number} voltage - Spänning i volt
   * @param {number} resistance - Resistans i ohm
   * @returns {number} - Effekt i watt
   */
  export const calculatePowerFromVoltageAndResistance = (voltage, resistance) => {
    // P = U^2 / R
    return Math.pow(voltage, 2) / resistance;
  };
  
  /**
   * Beräknar strömdelning i en parallellkoppling
   * @param {number} totalCurrent - Total ström
   * @param {number} totalResistance - Total resistans för hela parallellkopplingen
   * @param {number} branchResistance - Resistans för den gren vi beräknar strömmen för
   * @returns {number} - Ström genom grenen
   */
  export const calculateBranchCurrent = (totalCurrent, totalResistance, branchResistance) => {
    // I_branch = I_total * (R_total / R_branch)
    return totalCurrent * (totalResistance / branchResistance);
  };
  
  /**
   * Avrundar ett tal till ett visst antal decimaler
   * @param {number} value - Värdet som ska avrundas
   * @param {number} decimals - Antal decimaler
   * @returns {number} - Avrundat värde
   */
  export const roundToDecimals = (value, decimals = 2) => {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  };