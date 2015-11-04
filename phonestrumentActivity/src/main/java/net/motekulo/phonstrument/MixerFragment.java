package net.motekulo.phonstrument;

import java.io.File;

import net.motekulo.phonstrument.HorizontalFader.HorizontalFaderPositionListener;
import net.motekulo.phonstrument.VerticalFader.VerticalFaderPositionListener;

import org.puredata.core.PdBase;

import android.app.Fragment;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Environment;
//import android.support.v4.app.Fragment;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.TextView.OnEditorActionListener;
import android.widget.ToggleButton;

public class MixerFragment extends Fragment implements OnClickListener{

	protected static final String APP_NAME = "Phonstrument";
	private EditText exportNameTextView;
	private String currentProjectName;
	//	private boolean pdServiceConnection = false;
	//	private PdService pdService = null;
	private ImageButton recButton;
	private ImageButton stopButton;
	//private SeekBar synth1Pan;
	private HorizontalFader synth1Pan;

	private HorizontalFader synth2Pan;
	private HorizontalFader dr1Pan;
	private HorizontalFader dr2Pan;
	private HorizontalFader dr3Pan;
	private HorizontalFader dr4Pan;
	private VerticalFader synth1Vol;
	private VerticalFader synth2Vol;
	private VerticalFader dr1Vol;
	private VerticalFader dr2Vol;
	private VerticalFader dr3Vol;
	private VerticalFader dr4Vol;
	private ToggleButton mainSwitch;

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {

		View view = inflater.inflate(R.layout.mixer, container, false);

		readPreferences();

		//		recButton = (ImageButton) view.findViewById(R.id.button1);
		//		recButton.setOnClickListener(this);
		//
		//		stopButton = (ImageButton) view.findViewById(R.id.button2);
		//		stopButton.setOnClickListener(this);

		mainSwitch = (ToggleButton) view.findViewById(R.id.mainSwitch);
		mainSwitch.setChecked(true);
		mainSwitch.setOnClickListener(this);

		synth1Pan = (HorizontalFader) view.findViewById(R.id.horFader1);
		synth1Pan.setPositionListener(horFaderChanged);

		synth2Pan = (HorizontalFader) view.findViewById(R.id.horFader6);
		synth2Pan.setPositionListener(horFaderChanged);

		dr1Pan = (HorizontalFader) view.findViewById(R.id.horFader2);
		dr1Pan.setPositionListener(horFaderChanged);

		dr2Pan = (HorizontalFader) view.findViewById(R.id.horFader3);
		dr2Pan.setPositionListener(horFaderChanged);

		dr3Pan = (HorizontalFader) view.findViewById(R.id.horFader4);
		dr3Pan.setPositionListener(horFaderChanged);

		dr4Pan = (HorizontalFader) view.findViewById(R.id.horFader5);
		dr4Pan.setPositionListener(horFaderChanged);

		synth1Vol = (VerticalFader) view.findViewById(R.id.verticalFader1);
		synth1Vol.setPositionListener(faderChanged);
		synth1Vol.setmKnobPosition(50);

		synth2Vol = (VerticalFader) view.findViewById(R.id.verticalFader6);
		synth2Vol.setPositionListener(faderChanged);

		dr1Vol = (VerticalFader) view.findViewById(R.id.verticalFader2);
		dr1Vol.setPositionListener(faderChanged);

		dr2Vol = (VerticalFader) view.findViewById(R.id.verticalFader3);
		dr2Vol.setPositionListener(faderChanged);

		dr3Vol = (VerticalFader) view.findViewById(R.id.verticalFader4);
		dr3Vol.setPositionListener(faderChanged);

		dr4Vol = (VerticalFader) view.findViewById(R.id.verticalFader5);
		dr4Vol.setPositionListener(faderChanged);

		exportNameTextView = (EditText) view.findViewById(R.id.editText1);
		exportNameTextView.setOnEditorActionListener(projectNameEditorChanged);

		exportNameTextView.setText(currentProjectName);

		return view;

	}

	private TextView.OnEditorActionListener projectNameEditorChanged =  new OnEditorActionListener() {
		@Override
		public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {

			boolean handled = false;

			if (actionId == EditorInfo.IME_ACTION_DONE) {
				InputMethodManager imm = (InputMethodManager)getActivity().getSystemService(
						Context.INPUT_METHOD_SERVICE);
				imm.hideSoftInputFromWindow(exportNameTextView.getWindowToken(), 0);
				//Log.i(APP_NAME, "changed name to " + v.getText());

				String newExportName = v.getText().toString().trim();

				currentProjectName = newExportName;
				SharedPreferences preferences = getActivity().getSharedPreferences("Phonstrument", 0);

				SharedPreferences.Editor editor = preferences.edit();

				editor.putString("CurrentProjectName", currentProjectName);
				editor.commit();

			}	

			handled = true;

			return handled;
		}
	};



	private HorizontalFader.HorizontalFaderPositionListener horFaderChanged = new HorizontalFaderPositionListener() {
		@Override
		public void onPositionChange(View fader, int newPosition) {
			float panValue = (float) newPosition / 100;
			switch (fader.getId()) {

			case R.id.horFader1:
				PdBase.sendFloat("synth_1_pan", panValue);
				break;

			case R.id.horFader2:
				PdBase.sendFloat("synth_2_pan", panValue);
				break;

			case R.id.horFader3: 
				PdBase.sendFloat("player_1_pan", panValue);
				break;

			case R.id.horFader4:
				PdBase.sendFloat("player_2_pan", panValue);
				break;

			case R.id.horFader5:
				PdBase.sendFloat("player_3_pan", panValue);
				break;

			case R.id.horFader6:
				PdBase.sendFloat("player_4_pan", panValue);
				break;

			}
		}
	};

	private VerticalFader.VerticalFaderPositionListener faderChanged = new VerticalFaderPositionListener() {
		@Override
		public void onPositionChange(View fader, int newPosition) {
			float volValue = (float) newPosition / 100;
			switch (fader.getId()) {

			case R.id.verticalFader1:
				PdBase.sendFloat("synth_1_vol", volValue);
				break;

			case R.id.verticalFader2:
				PdBase.sendFloat("synth_2_volume", volValue);						
				break;

			case R.id.verticalFader3:
				PdBase.sendFloat("player_1_vol", volValue);				
				break;

			case R.id.verticalFader4:
				PdBase.sendFloat("player_2_vol", volValue);				
				break;

			case R.id.verticalFader5:
				PdBase.sendFloat("player_3_vol", volValue);				
				break;

			case R.id.verticalFader6:
				PdBase.sendFloat("player_4_vol", volValue);	
				break;

			}
		}
	};

	private void readPreferences() {
		SharedPreferences preferences = getActivity().getSharedPreferences("Phonstrument", Context.MODE_PRIVATE);
		currentProjectName = preferences.getString("CurrentProjectName", "untitled");

	}

	@Override
	public void onClick(View v) {
		switch(v.getId()) {
		case R.id.button1:
			// Start recording
			String filepath = Environment.getExternalStorageDirectory().getPath();
			File appdir = new File(filepath, PhonestrumentActivity.APP_DATA_DIR_NAME);

			if (!appdir.exists()) {
				appdir.mkdirs();
			}

			File exportFile = new File(appdir, currentProjectName);

			PdBase.sendMessage("set_record_file", exportFile.getAbsolutePath(), 0);
			recButton.setImageResource(R.drawable.recording);

			break;

		case R.id.button2:
			// Stop recording
			PdBase.sendBang("stop_rec");
			recButton.setImageResource(R.drawable.record);
			break;


		case R.id.mainSwitch:
			toggleMainSwitch();

			break;
		}
	}

	private void toggleMainSwitch() {
		PdBase.sendBang("metro_on");
		if (mainSwitch.isChecked() == true) {
		}

		if (mainSwitch.isChecked() == false) {
			PdBase.sendFloat("metro_on", 0);
		}

	}

}
