package net.motekulo.phonstrument;

import org.puredata.android.utils.PdUiDispatcher;
import org.puredata.core.PdBase;
import org.puredata.core.PdListener;

import android.app.Fragment;
import android.os.Bundle;
//import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;

public class SynthSequencerFragment extends Fragment implements OnClickListener{
	protected static final String APP_NAME = "Phonstrument";
	//private boolean pdServiceConnection = false;
	//private PdService pdService = null;
	private PdUiDispatcher dispatcher;

	private XYControllerView XYController;
	private Button chord1;
	private Button chord2;
	private Button chord3;
	private Button chord4;
	private Button chord5;
	private Button chord6;
	private Button chord7;
	private float[] sequence;
	//private ToggleButton mainSwitch;


	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		// Inflate the layout for this fragment
		//Intent myIntent = new Intent();
		// bindService(new Intent(this, PdService.class), pdConnection, BIND_AUTO_CREATE);	
	//	getActivity().bindService(myIntent, pdConnection, 0);  

		View view = inflater.inflate(R.layout.synth_sequencer, container, false);

//		mainSwitch = (ToggleButton) view.findViewById(R.id.mainSwitch);
//		mainSwitch.setChecked(true);
//		mainSwitch.setOnClickListener(this);

		XYController = (XYControllerView) view.findViewById(R.id.xYControllerView1);
		XYController.setTouchListener(MouseMovement);

		chord1 = (Button) view.findViewById(R.id.button1);
		chord1.setOnClickListener(this);

		chord2 = (Button) view.findViewById(R.id.button2);
		chord2.setOnClickListener(this);

		chord3 = (Button) view.findViewById(R.id.button3);
		chord3.setOnClickListener(this);

		chord4 = (Button) view.findViewById(R.id.button4);
		chord4.setOnClickListener(this);

		chord5 = (Button) view.findViewById(R.id.button5);
		chord5.setOnClickListener(this);

		chord6 = (Button) view.findViewById(R.id.button6);
		chord6.setOnClickListener(this);

		chord7 = (Button) view.findViewById(R.id.button7);
		chord7.setOnClickListener(this);

		Spinner spinner1 = (Spinner) view.findViewById(R.id.spinner1);
		// Create an ArrayAdapter using the string array and a default spinner layout
		ArrayAdapter<CharSequence> adapter1 = ArrayAdapter.createFromResource(getActivity(),
				R.array.key_list, android.R.layout.simple_spinner_item);
		// Specify the layout to use when the list of choices appears
		adapter1.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
		// Apply the adapter to the spinner
		spinner1.setAdapter(adapter1);
		spinner1.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
			public void onItemSelected(AdapterView<?> parent, View view, 
					int pos, long id) {

				String tmp = parent.getItemAtPosition(pos).toString();
				
				PdBase.sendFloat("key", 36 + pos); // 24 is the midi number of the lowest C we use here

			}
			public void onNothingSelected(AdapterView<?> parent) {
				// Another interface callback
			}
		});

		sequence = new float[16];

		return view;
	}

	@Override
	public void onResume() {
		super.onResume();

		dispatcher = new PdUiDispatcher();
		PdBase.setReceiver(dispatcher);

		dispatcher.addListener("beatnum", new PdListener.Adapter() {
			@Override
			public void receiveFloat(String source, float x) {

				XYController.setCurrentBeat((int)x);

			}
		});
		int[] sequenceToDisplay = new int[16];
		PdBase.readArray(sequence, 0, "sequence", 0, 16);
		XYController.setToggleState(convertFloatArrayToIntArray(sequence, sequenceToDisplay));
	}

	private int[] convertFloatArrayToIntArray(float[] floatArray, int[] intArray){

		for (int i = 0; i < floatArray.length; i++) {
			intArray[i] = (int) floatArray[i];
		}
		return intArray;
	}

	public void updateDetail() {

		//Log.i("Phonstrument", "In the sequencer fragment test");
		PdBase.sendFloat("tempo", 50);
	}

	private XYControllerView.touchListener MouseMovement = new XYControllerView.touchListener() {

		@Override
		public void onPositionChange(View view, int mouseX, int mouseY) {

			//Log.i(APP_NAME, "Xpos, Ypos: " + mouseX + ", " + mouseY);
			sequence[mouseX] = mouseY;
			PdBase.writeArray("sequence", 0, sequence, 0, 16);

		}
	};

	@Override
	public void onClick(View v) {
		switch(v.getId()) {
		case R.id.button1:
			//Log.i(APP_NAME, "chord I");
			PdBase.sendFloat("chord", 0);
			break;

		case R.id.button2:
			//Log.i(APP_NAME, "chord ii");
			PdBase.sendFloat("chord", 1);
			break;

		case R.id.button3:
			//Log.i(APP_NAME, "chord iii");
			PdBase.sendFloat("chord", 2);
			break;

		case R.id.button4:
			//Log.i(APP_NAME, "chord IV");
			PdBase.sendFloat("chord", 3);
			break;

		case R.id.button5:
			//Log.i(APP_NAME, "chord V");
			PdBase.sendFloat("chord", 4);
			break;

		case R.id.button6:
			//Log.i(APP_NAME, "chord vi");
			PdBase.sendFloat("chord", 5);
			break;

		case R.id.button7:
			//Log.i(APP_NAME, "chord vii");
			PdBase.sendFloat("chord", 6);
			break;


		
		}
	}	

	
}
