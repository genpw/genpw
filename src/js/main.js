import { PasswordGenerator } from '../passwordgenerator';
import { u } from 'umbrellajs';

const pw = new PasswordGenerator();

u('#theBestPassword').text( pw.generate(7));
